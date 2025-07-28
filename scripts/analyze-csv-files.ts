// Script para analisar os arquivos CSV e extrair os cabeçalhos corretos

async function fetchAndAnalyzeCSV(url: string, filename: string) {
  try {
    const response = await fetch(url)
    const text = await response.text()
    const lines = text.split("\n")
    const headers = lines[0].split(";").map((h) => h.trim().replace(/"/g, ""))

    console.log(`\n=== ${filename.toUpperCase()} ===`)
    console.log("Headers:", headers)
    console.log("Total headers:", headers.length)
    console.log("Sample data:", lines[1] ? lines[1].split(";").slice(0, 5) : "No data")

    return { filename, headers, sampleData: lines.slice(0, 3) }
  } catch (error) {
    console.error(`Erro ao analisar ${filename}:`, error)
    return null
  }
}

async function analyzeAllFiles() {
  const files = [
    {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pessoa-Uy5lNUWbKJ06o8NErPXHMqYiosZQeL.csv",
      name: "pessoa",
    },
    {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/produto-OKCuE1uWoAqAtzg6UPgBLroZkKem7N.csv",
      name: "produto",
    },
    {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cliente_especializacao-0faJOM7h5bmRR50MJy0o5z3DAdpdz0.csv",
      name: "cliente_especializacao",
    },
    {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/deposito-utMlqzVXLzYqtuno06gjsnnZ7fdmTf.csv",
      name: "deposito",
    },
    {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/conversao_unidade_medida-OgFt04fEC4Td1mlnAYA5wnlBzu5c08.csv",
      name: "conversao_unidade_medida",
    },
    {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/engenharia-TcL0Hv2QIRJavBk4RqKg3WwCLZAlWy.csv",
      name: "engenharia",
    },
    {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/plano-financeiro-6qzw1FjsT6tPl0sORAyJohckhhNoe1.csv",
      name: "plano-financeiro",
    },
    {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/plano-contabil-lRlj9vkPAe4p4hnRgQNO0bJCtPclQT.csv",
      name: "plano-contabil",
    },
    {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/plano-centro-custo-ZR0SqszR4ouWkKtHCbmM02j4R6mKsO.csv",
      name: "plano-centro-custo",
    },
    {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/peps-entrada-zRCkm9Djin30lDvafQ2rZtgodbHrec.csv",
      name: "peps-entrada",
    },
  ]

  const results = []
  for (const file of files) {
    const result = await fetchAndAnalyzeCSV(file.url, file.name)
    if (result) results.push(result)
  }

  console.log("\n=== RESUMO DOS CABEÇALHOS ===")
  results.forEach((result) => {
    console.log(`${result.filename}: [${result.headers.map((h) => `"${h}"`).join(", ")}]`)
  })

  return results
}

// Executar análise
analyzeAllFiles()
