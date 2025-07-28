import { SUBJECTS } from "./subjects"

export async function validateSpreadsheet(file: File, subject: string) {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const csv = e.target?.result as string
      const lines = csv.split("\n")
      const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

      // Ignora a primeira linha (cabeçalho)
      let dataLines = lines.slice(1).filter((line) => line.trim())

      const corrections: any[] = []
      const correctedRows: string[] = []
      let correctedCount = 0
      let errorCount = 0

      const subjectConfig = SUBJECTS[subject]
      if (!subjectConfig) {
        resolve({
          totalRows: 0,
          correctedRows: 0,
          errors: 1,
          corrections: [{ row: 0, column: "GERAL", before: "", after: "", reason: "Assunto não encontrado" }],
          correctedData: "",
        })
        return
      }

      // Remove duplicatas baseado na chave única do assunto
      const { cleanedData, duplicatesRemoved } = removeDuplicates(dataLines, headers, subject)
      dataLines = cleanedData
      
      if (duplicatesRemoved.length > 0) {
        duplicatesRemoved.forEach(duplicate => {
          corrections.push({
            row: duplicate.row,
            column: duplicate.keyColumn,
            before: duplicate.value,
            after: "REMOVIDO",
            reason: `Linha duplicada removida - ${duplicate.keyColumn}: ${duplicate.value}`,
          })
          correctedCount++
        })
      }

      // Adiciona o cabeçalho ao resultado
      correctedRows.push(headers.join(","))

      // Aplica validações específicas para planos hierárquicos
      if (["PLANO_FINANCEIRO", "PLANO_CONTABIL", "PLANO_CENTRO_CUSTO"].includes(subject)) {
        dataLines = applyHierarchicalValidation(dataLines, headers, corrections, subject)
      }

      dataLines.forEach((line, rowIndex) => {
        const values = line.split(",").map((v) => v.trim().replace(/"/g, ""))
        const correctedValues = [...values]

        headers.forEach((header, colIndex) => {
          const column = subjectConfig.columns.find((col: any) => col.name === header)
          if (!column || colIndex >= values.length) return

          const originalValue = values[colIndex]

          // Aplica as regras de correção baseadas no tipo
          const correctionResult = applyValidationRules(originalValue, column, subject, header, values, headers)

          if (correctionResult.corrected !== originalValue) {
            corrections.push({
              row: rowIndex + 2, // +2 porque começamos do índice 0 e pulamos o cabeçalho
              column: header,
              before: originalValue,
              after: correctionResult.corrected,
              reason: correctionResult.reason,
            })
            correctedValues[colIndex] = correctionResult.corrected
            correctedCount++
          }

          if (correctionResult.hasError) {
            errorCount++
          }
        })

        correctedRows.push(correctedValues.join(","))
      })

      resolve({
        totalRows: dataLines.length,
        correctedRows: correctedCount,
        errors: errorCount,
        corrections,
        correctedData: correctedRows.join("\n"),
      })
    }

    reader.readAsText(file, "UTF-8")
  })
}

function applyValidationRules(value: string, column: any, subject: string, columnName: string, allValues?: string[], headers?: string[]) {
  let corrected = value
  let reason = ""
  let hasError = false

  if (!value || value.trim() === "") {
    // Aplica valores padrão para campos específicos quando vazios
    const defaultValue = getDefaultValue(columnName, subject)
    if (defaultValue) {
      corrected = defaultValue
      reason = `Preenchido com valor padrão: ${defaultValue}`
    }
    return { corrected, reason, hasError: false }
  }

  // Regras específicas por tipo de coluna
  switch (column.type) {
    case "numeric":
      // Remove caracteres não numéricos
      const numericValue = value.replace(/[^0-9]/g, "")
      if (numericValue !== value) {
        corrected = numericValue
        reason = "Removidos caracteres não numéricos"
      }

      // Completa com zeros à esquerda se necessário
      if (column.maxLength && numericValue.length < column.maxLength) {
        corrected = numericValue.padStart(column.maxLength, "0")
        if (corrected !== numericValue) {
          reason = reason ? reason + " e completado com zeros à esquerda" : "Completado com zeros à esquerda"
        }
      }
      break

    case "document":
      // CNPJ/CPF - remove caracteres especiais e completa com zeros
      const docValue = value.replace(/[^0-9]/g, "")
      if (docValue.length <= 11) {
        // CPF
        corrected = docValue.padStart(11, "0")
      } else {
        // CNPJ
        corrected = docValue.padStart(14, "0")
      }
      if (corrected !== value) {
        reason = "Formatado documento (CPF/CNPJ) e completado com zeros"
      }
      break

    case "enum":
      // Corrige valores de enumeração
      const enumCorrection = correctEnumValue(value, column.values, columnName)
      if (enumCorrection.corrected !== value) {
        corrected = enumCorrection.corrected
        reason = enumCorrection.reason
        hasError = enumCorrection.hasError
      }
      break

    case "text":
      // Limita o tamanho do texto
      if (column.maxLength && value.length > column.maxLength) {
        corrected = value.substring(0, column.maxLength)
        reason = `Texto truncado para ${column.maxLength} caracteres`
      }
      break

    case "email":
      // Valida e corrige email
      const emailCorrection = correctEmail(value)
      if (emailCorrection.corrected !== value) {
        corrected = emailCorrection.corrected
        reason = emailCorrection.reason
      }
      break

    case "email_multiple":
      // Corrige múltiplos emails
      const multiEmailCorrection = correctMultipleEmails(value)
      if (multiEmailCorrection.corrected !== value) {
        corrected = multiEmailCorrection.corrected
        reason = multiEmailCorrection.reason
      }
      break

    case "date":
      // Validação específica para títulos - DATA_ENTRADA não pode ser menor que DATA_EMISSAO
      if (columnName === "DATA_ENTRADA" && headers && allValues) {
        const dataEmissaoIndex = headers.indexOf("DATA_EMISSAO")
        if (dataEmissaoIndex !== -1 && allValues[dataEmissaoIndex]) {
          const dataEmissao = parseDate(allValues[dataEmissaoIndex])
          const dataEntrada = parseDate(value)
          if (dataEntrada && dataEmissao && dataEntrada < dataEmissao) {
            corrected = allValues[dataEmissaoIndex]
            reason = "DATA_ENTRADA corrigida para DATA_EMISSAO (não pode ser anterior)"
          }
        }
      }
      break
  }

  // Regras específicas por nome de coluna
  const specificCorrection = applySpecificColumnRules(value, columnName, subject, allValues, headers)
  if (specificCorrection.corrected !== value) {
    corrected = specificCorrection.corrected
    reason = reason ? reason + " e " + specificCorrection.reason : specificCorrection.reason
    hasError = specificCorrection.hasError || hasError
  }

  return { corrected, reason, hasError }
}

function correctEnumValue(value: string, allowedValues: string[], columnName: string) {
  const upperValue = value.toUpperCase().trim()

  // Verifica se já está correto
  if (allowedValues.includes(upperValue)) {
    return { corrected: upperValue, reason: "Convertido para maiúscula", hasError: false }
  }

  // Regras específicas por tipo de campo
  switch (columnName) {
    case "TIPO_PESSOA":
      if (["CPF", "PF", "PESSOA", "PESSOA FISICA", "FISICA"].includes(upperValue)) {
        return { corrected: "FISICA", reason: "Corrigido para FISICA", hasError: false }
      }
      if (["PJ", "CNPJ", "JURIDICA", "PESSOA JURIDICA"].includes(upperValue)) {
        return { corrected: "JURIDICA", reason: "Corrigido para JURIDICA", hasError: false }
      }
      break

    case "TIPO_MERCADO":
      if (["I", "INTERNO", "BRASIL", "NACIONAL"].includes(upperValue)) {
        return { corrected: "INTERNO", reason: "Corrigido para INTERNO", hasError: false }
      }
      if (["E", "EX", "EXTERNO", "EXTERIOR", "INTERNACIONAL"].includes(upperValue)) {
        return { corrected: "EXTERNO", reason: "Corrigido para EXTERNO", hasError: false }
      }
      break

    case "SITUACAO":
    case "Situação":
      if (["ATIVO", "SIM", "ATIVA", "S", "A"].includes(upperValue)) {
        return { corrected: "ATIVO", reason: "Corrigido para ATIVO", hasError: false }
      }
      if (["INATIVO", "NAO", "NÃO", "INATIVA", "N", "I"].includes(upperValue)) {
        return { corrected: "INATIVO", reason: "Corrigido para INATIVO", hasError: false }
      }
      break

    case "CODIGO_REGIME_TRIBUTARIO":
      if (["SIMPLES", "MICROEMPRESA", "MICROEMPRESARIO", "SIMPLES NACIONAL", "ME"].includes(upperValue)) {
        return { corrected: "SIMPLES", reason: "Corrigido para SIMPLES", hasError: false }
      }
      if (["NORMAL", "REAL", "LUCRO REAL", "LUCRO_REAL"].includes(upperValue)) {
        return { corrected: "NORMAL", reason: "Corrigido para NORMAL", hasError: false }
      }
      break

    case "TIPO_ATIVIDADE":
      const activityMap: { [key: string]: string } = {
        IND: "INDUSTRIA",
        COM: "COMERCIO",
        COMERCIO: "COMERCIO", // Nova regra: Comércio = COMERCIO
        "COMÉRCIO": "COMERCIO",
        OUTROS: "OUTROS",
        COOPERATIVO: "COOPERATIVA",
        IMOBILIARIA: "ATIVIDADE_IMOBILIARIA",
      }

      const normalizedActivity = upperValue.replace(/\s+/g, "_")
      if (activityMap[normalizedActivity]) {
        return {
          corrected: activityMap[normalizedActivity],
          reason: `Corrigido para ${activityMap[normalizedActivity]}`,
          hasError: false,
        }
      }
      break

    default:
      // Tenta corrigir SIM/NÃO genérico
      if (["SIM", "S", "YES", "Y", "PODE", "ATIVO", "TRUE", "1"].includes(upperValue)) {
        return { corrected: "SIM", reason: "Corrigido para SIM", hasError: false }
      }
      if (["NAO", "NÃO", "N", "NO", "NAO PODE", "NÃO PODE", "INATIVO", "FALSE", "0"].includes(upperValue)) {
        return { corrected: "NAO", reason: "Corrigido para NAO", hasError: false }
      }
  }

  return { corrected: value, reason: `Valor "${value}" não reconhecido para ${columnName}`, hasError: true }
}

function correctEmail(value: string) {
  const trimmed = value.trim().toLowerCase()

  // Validação básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (emailRegex.test(trimmed)) {
    return { corrected: trimmed, reason: "Email formatado", hasError: false }
  }

  return { corrected: value, reason: "Email inválido", hasError: true }
}

function correctMultipleEmails(value: string) {
  // Detecta separadores comuns e converte para o formato correto
  const separators = [";", ",", "/", "+"]
  let emails = [value]

  for (const sep of separators) {
    if (value.includes(sep)) {
      emails = value.split(sep).map((e) => e.trim().toLowerCase())
      break
    }
  }

  // Valida cada email
  const validEmails = emails.filter((email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  })

  if (validEmails.length > 0) {
    const corrected = `"${validEmails.join(";")}"`
    return { corrected, reason: "Emails formatados e separados corretamente", hasError: false }
  }

  return { corrected: value, reason: "Emails inválidos", hasError: true }
}

function applySpecificColumnRules(value: string, columnName: string, subject: string, allValues?: string[], headers?: string[]) {
  let corrected = value
  let reason = ""
  const hasError = false

  switch (columnName) {
    case "CEP":
      // Remove caracteres não numéricos e completa com zeros
      const cepValue = value.replace(/[^0-9]/g, "")
      corrected = cepValue.padStart(8, "0")
      if (corrected !== value) {
        reason = "CEP formatado e completado com zeros"
      }
      break

    case "TELEFONE":
      // Apenas números
      corrected = value.replace(/[^0-9]/g, "")
      if (corrected !== value) {
        reason = "Removidos caracteres não numéricos do telefone"
      }
      break

    case "NCM":
      // Apenas números, completa com zeros à esquerda
      const ncmValue = value.replace(/[^0-9]/g, "")
      corrected = ncmValue.padStart(8, "0")
      if (corrected !== value) {
        reason = "NCM formatado e completado com zeros"
      }
      break

    case "Origem fiscal da mercadoria":
    case "ORIGEM_FISCAL_MERCADORIA":
    case "ORIGEM DA MERCADORIA":
      if (["NACIONAL", "BRASIL", "BR"].includes(value.toUpperCase())) {
        corrected = "0"
        reason = "Corrigido para origem nacional (0)"
      } else if (["INTERNACIONAL", "IMPORTADO", "EXTERIOR"].includes(value.toUpperCase())) {
        corrected = "1"
        reason = "Corrigido para origem internacional (1)"
      }
      break

    case "Código da unidade de medida de venda":
    case "CODIGO_UNIDADE_MEDIDA":
      // Mapear descrições para códigos
      const unitMap: { [key: string]: string } = {
        UNIDADE: "UNID",
        METRO: "M",
        METROS: "M",
        MMMM: "M",
        QUILOGRAMA: "KG",
        QUILO: "KG",
        GRAMA: "G",
        LITRO: "L",
        MILILITRO: "ML",
        CENTIMETRO: "CM",
        MILIMETRO: "MM",
        PECA: "PC",
        PECAS: "PC",
        CAIXA: "CX",
        PACOTE: "PCT",
        SACO: "SC",
      }

      const upperUnit = value.toUpperCase().trim()
      if (unitMap[upperUnit]) {
        corrected = unitMap[upperUnit]
        reason = `Unidade de medida corrigida de "${value}" para "${corrected}"`
      }
      break

    case "PORTADOR":
      // Formatar com 3 dígitos
      if (value && value.trim()) {
        const numericPortador = value.replace(/[^0-9]/g, "")
        corrected = numericPortador.padStart(3, "0")
        if (corrected !== value) {
          reason = "PORTADOR formatado com 3 dígitos"
        }
      }
      break

    case "CARTEIRA":
      // Formatar com 2 dígitos
      if (value && value.trim()) {
        const numericCarteira = value.replace(/[^0-9]/g, "")
        corrected = numericCarteira.padStart(2, "0")
        if (corrected !== value) {
          reason = "CARTEIRA formatada com 2 dígitos"
        }
      }
      break

    case "NUMERO_TITULO":
      // Validar duplicatas nos títulos - verificar se FORNECEDOR e CNPJ_CPF não estão ambos preenchidos
      if (subject === "TITULOS_PAGAR" && headers && allValues) {
        const fornecedorIndex = headers.indexOf("FORNECEDOR")
        const cnpjCpfIndex = headers.indexOf("CNPJ_CPF")
        
        if (fornecedorIndex !== -1 && cnpjCpfIndex !== -1) {
          const fornecedor = allValues[fornecedorIndex]
          const cnpjCpf = allValues[cnpjCpfIndex]
          
          if (fornecedor && fornecedor.trim() && cnpjCpf && cnpjCpf.trim()) {
            // Se ambos estão preenchidos, limpar CNPJ_CPF
            allValues[cnpjCpfIndex] = ""
            reason = "CNPJ_CPF removido pois FORNECEDOR já está preenchido"
          }
        }
      }
      
      if (subject === "TITULOS_RECEBER" && headers && allValues) {
        const clienteIndex = headers.indexOf("CLIENTE")
        const cnpjCpfIndex = headers.indexOf("CNPJ_CPF")
        
        if (clienteIndex !== -1 && cnpjCpfIndex !== -1) {
          const cliente = allValues[clienteIndex]
          const cnpjCpf = allValues[cnpjCpfIndex]
          
          if (cliente && cliente.trim() && cnpjCpf && cnpjCpf.trim()) {
            // Se ambos estão preenchidos, limpar CNPJ_CPF
            allValues[cnpjCpfIndex] = ""
            reason = "CNPJ_CPF removido pois CLIENTE já está preenchido"
          }
        }
      }
      break
  }

  return { corrected, reason, hasError }
}

// Função para obter valores padrão para campos específicos
function getDefaultValue(columnName: string, subject: string): string | null {
  switch (columnName) {
    case "MOEDA":
      return "BRL"
    case "PORTADOR":
      return "999"
    case "CARTEIRA":
      return "99"
    case "TRANSACAO":
      if (subject === "TITULOS_PAGAR") return "90500"
      if (subject === "TITULOS_RECEBER") return "90300"
      return null
    case "TIPO_TITULO":
      if (subject === "TITULOS_PAGAR") return "NFC"
      if (subject === "TITULOS_RECEBER") return "NFS"
      return null
    default:
      return null
  }
}

// Função para remover duplicatas baseado na chave única do assunto
function removeDuplicates(dataLines: string[], headers: string[], subject: string) {
  const keyColumns = getUniqueKeyColumns(subject)
  if (!keyColumns.length) {
    return { cleanedData: dataLines, duplicatesRemoved: [] }
  }

  const seen = new Set<string>()
  const cleanedData: string[] = []
  const duplicatesRemoved: any[] = []

  dataLines.forEach((line, index) => {
    const values = line.split(",").map((v) => v.trim().replace(/"/g, ""))
    
    // Cria uma chave única baseada nas colunas de identificação
    const keyValues = keyColumns.map(colName => {
      const colIndex = headers.indexOf(colName)
      return colIndex !== -1 ? values[colIndex] : ""
    }).filter(val => val.trim() !== "")

    if (keyValues.length === 0) {
      cleanedData.push(line)
      return
    }

    const uniqueKey = keyValues.join("|")
    
    if (seen.has(uniqueKey)) {
      duplicatesRemoved.push({
        row: index + 2, // +2 porque começamos do índice 0 e pulamos o cabeçalho
        keyColumn: keyColumns[0],
        value: keyValues[0],
      })
    } else {
      seen.add(uniqueKey)
      cleanedData.push(line)
    }
  })

  return { cleanedData, duplicatesRemoved }
}

// Função para obter as colunas que definem a chave única por assunto
function getUniqueKeyColumns(subject: string): string[] {
  switch (subject) {
    case "PESSOAS":
      return ["CODIGO"]
    case "PRODUTOS":
      return ["Código"]
    case "TITULOS_PAGAR":
    case "TITULOS_RECEBER":
      return ["NUMERO_TITULO"]
    default:
      return []
  }
}

// Função para validação hierárquica de planos (financeiro, contábil, centro de custo)
function applyHierarchicalValidation(dataLines: string[], headers: string[], corrections: any[], subject: string): string[] {
  const contaIndex = headers.findIndex(h => 
    h.includes("CONTA") || h.includes("CODIGO") || h === "Código"
  )
  const analiticaSinteticaIndex = headers.findIndex(h => 
    h.includes("ANALITICA") || h.includes("SINTETICA") || h.includes("TIPO")
  )
  const nivelIndex = headers.findIndex(h => 
    h.includes("NIVEL") || h.includes("GRAU")
  )

  if (contaIndex === -1) return dataLines

  const processedLines: string[] = []

  dataLines.forEach((line, rowIndex) => {
    const values = line.split(",").map((v) => v.trim().replace(/"/g, ""))
    let conta = values[contaIndex]

    if (!conta) {
      processedLines.push(line)
      return
    }

    // Corrige formatação da conta (ex: 1.1.0403 -> 1.1.04.03)
    const correctedConta = formatAccountNumber(conta)
    if (correctedConta !== conta) {
      values[contaIndex] = correctedConta
      corrections.push({
        row: rowIndex + 2,
        column: headers[contaIndex],
        before: conta,
        after: correctedConta,
        reason: "Formatação da conta corrigida"
      })
      conta = correctedConta
    }

    // Remove .00 de contas sintéticas iniciais
    if (conta.endsWith(".00")) {
      const newConta = conta.replace(".00", "")
      values[contaIndex] = newConta
      corrections.push({
        row: rowIndex + 2,
        column: headers[contaIndex],
        before: conta,
        after: newConta,
        reason: "Removido .00 de conta sintética inicial"
      })
      conta = newConta
    }

    // Determina o nível da conta
    const nivel = calculateAccountLevel(conta)
    if (nivelIndex !== -1 && values[nivelIndex] !== nivel.toString()) {
      corrections.push({
        row: rowIndex + 2,
        column: headers[nivelIndex],
        before: values[nivelIndex],
        after: nivel.toString(),
        reason: "Nível da conta corrigido automaticamente"
      })
      values[nivelIndex] = nivel.toString()
    }

    // Determina se é analítica ou sintética
    if (analiticaSinteticaIndex !== -1) {
      const isAnalytic = determineIfAnalytic(conta, dataLines, contaIndex, rowIndex)
      const currentType = values[analiticaSinteticaIndex].toUpperCase()
      const correctType = isAnalytic ? "ANALITICA" : "SINTETICA"
      
      if (currentType !== correctType) {
        corrections.push({
          row: rowIndex + 2,
          column: headers[analiticaSinteticaIndex],
          before: currentType,
          after: correctType,
          reason: `Tipo corrigido para ${correctType} baseado na estrutura`
        })
        values[analiticaSinteticaIndex] = correctType
      }
    }

    processedLines.push(values.join(","))
  })

  return processedLines
}

// Formatar número da conta (ex: 1.1.0403 -> 1.1.04.03)
function formatAccountNumber(conta: string): string {
  // Remove espaços e caracteres especiais desnecessários
  let formatted = conta.trim()
  
  // Verifica se precisa de formatação (contas sem pontos adequados)
  const parts = formatted.split(".")
  if (parts.length >= 3) {
    // Verifica se a última parte tem mais de 2 dígitos sem ponto
    const lastPart = parts[parts.length - 1]
    if (lastPart.length > 2 && !lastPart.includes(".")) {
      // Divide a última parte em grupos de 2 dígitos
      const newLastParts = []
      for (let i = 0; i < lastPart.length; i += 2) {
        newLastParts.push(lastPart.substr(i, 2))
      }
      parts[parts.length - 1] = newLastParts.join(".")
      formatted = parts.join(".")
    }
  }
  
  return formatted
}

// Calcular nível da conta baseado nos pontos
function calculateAccountLevel(conta: string): number {
  return conta.split(".").length
}

// Determinar se uma conta é analítica ou sintética
function determineIfAnalytic(conta: string, allLines: string[], contaIndex: number, currentIndex: number): boolean {
  // Uma conta é sintética se existem outras contas que começam com ela
  const contaPrefix = conta + "."
  
  for (let i = 0; i < allLines.length; i++) {
    if (i === currentIndex) continue
    
    const otherValues = allLines[i].split(",").map((v) => v.trim().replace(/"/g, ""))
    const otherConta = otherValues[contaIndex]
    
    if (otherConta && otherConta.startsWith(contaPrefix)) {
      return false // É sintética pois tem filhas
    }
  }
  
  return true // É analítica pois não tem filhas
}

// Função para fazer parse de data
function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null
  
  // Tenta diferentes formatos de data
  const formats = [
    /^(\d{2})\/(\d{2})\/(\d{4})$/, // dd/MM/yyyy
    /^(\d{2})-(\d{2})-(\d{4})$/, // dd-MM-yyyy
    /^(\d{4})-(\d{2})-(\d{2})$/, // yyyy-MM-dd
  ]
  
  for (const format of formats) {
    const match = dateStr.match(format)
    if (match) {
      if (format === formats[2]) {
        // yyyy-MM-dd
        return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]))
      } else {
        // dd/MM/yyyy ou dd-MM-yyyy
        return new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1]))
      }
    }
  }
  
  return null
}

