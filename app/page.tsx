"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Download, FileText, AlertCircle, CheckCircle, ExternalLink, Eye } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

// Mapeamento completo de unidades de medida - CÓDIGO -> DESCRIÇÃO
const UNIDADE_MEDIDA_MAP: { [key: string]: string } = {
  // Mapeamento direto (código correto)
  AMPOLA: "AMPOLA",
  BALDE: "BALDE",
  BANDEJ: "BANDEJA",
  BARRA: "BARRA",
  BISNAG: "BISNAGA",
  BLOCO: "BLOCO",
  BOBINA: "BOBINA",
  BOMB: "BOMBON",
  CAPS: "CAPSULA",
  CART: "CARTELA",
  CENTO: "CENTO",
  CJ: "CONJUNTO",
  CM: "CENTIMETRO",
  CM2: "CENTIMETRO QUADRADO",
  CX: "CAIXA",
  CX10: "CAIXA COM 10 ITENS",
  CX100: "CAIXA COM 100 ITENS",
  CX15: "CAIXA COM 15 ITENS",
  CX2: "CAIXA COM 2 ITENS",
  CX20: "CAIXA COM 20 ITENS",
  CX25: "CAIXA COM 25 ITENS",
  CX3: "CAIXA COM 3 ITENS",
  CX5: "CAIXA COM 5 ITENS",
  CX50: "CAIXA COM 50 ITENS",
  DISP: "DISPLAY",
  DUZIA: "DUZIA",
  EMBAL: "EMBALAGEM",
  FARDO: "FARDO",
  FOLHA: "FOLHA",
  FRASCO: "FRASCO",
  GALAO: "GALÃO",
  GF: "GARRAFA",
  GRAMAS: "GRAMAS",
  JOGO: "JOGO",
  K: "QUILATE",
  KG: "QUILOGRAMA",
  KIT: "KIT",
  LATA: "LATA",
  LITRO: "LITRO",
  M: "METRO",
  M2: "METRO QUADRADO",
  M3: "METRO CÚBICO",
  MILHEI: "MILHEIRO",
  ML: "MILILITRO",
  MWH: "MEGAWATT HORA",
  PACOTE: "PACOTE",
  PALETE: "PALETE",
  PARES: "PARES",
  PC: "PEÇA",
  POTE: "POTE",
  RESMA: "RESMA",
  ROLO: "ROLO",
  SACO: "SACO",
  SACOLA: "SACOLA",
  TAMBOR: "TAMBOR",
  TANQUE: "TANQUE",
  TON: "TONELADA",
  TUBO: "TUBO",
  UN: "UNIDADE",
  UNID: "UNIDADE",
  VASIL: "VASILHA",
  VIDRO: "VIDRO",

  // Mapeamento reverso (descrição -> código)
  AMPOLA: "AMPOLA",
  BALDE: "BALDE",
  BANDEJA: "BANDEJ",
  BARRA: "BARRA",
  BISNAGA: "BISNAG",
  BLOCO: "BLOCO",
  BOBINA: "BOBINA",
  BOMBON: "BOMB",
  CAPSULA: "CAPS",
  CARTELA: "CART",
  CENTO: "CENTO",
  CONJUNTO: "CJ",
  CENTIMETRO: "CM",
  "CENTIMETRO QUADRADO": "CM2",
  CAIXA: "CX",
  "CAIXA COM 10 ITENS": "CX10",
  "CAIXA COM 100 ITENS": "CX100",
  "CAIXA COM 15 ITENS": "CX15",
  "CAIXA COM 2 ITENS": "CX2",
  "CAIXA COM 20 ITENS": "CX20",
  "CAIXA COM 25 ITENS": "CX25",
  "CAIXA COM 3 ITENS": "CX3",
  "CAIXA COM 5 ITENS": "CX5",
  "CAIXA COM 50 ITENS": "CX50",
  DISPLAY: "DISP",
  DUZIA: "DUZIA",
  EMBALAGEM: "EMBAL",
  FARDO: "FARDO",
  FOLHA: "FOLHA",
  FRASCO: "FRASCO",
  GALÃO: "GALAO",
  GARRAFA: "GF",
  GRAMAS: "GRAMAS",
  JOGO: "JOGO",
  QUILATE: "K",
  QUILOGRAMA: "KG",
  KIT: "KIT",
  LATA: "LATA",
  LITRO: "LITRO",
  METRO: "M",
  "METRO QUADRADO": "M2",
  "METRO CÚBICO": "M3",
  MILHEIRO: "MILHEI",
  MILILITRO: "ML",
  "MEGAWATT HORA": "MWH",
  PACOTE: "PACOTE",
  PALETE: "PALETE",
  PARES: "PARES",
  PEÇA: "PC",
  POTE: "POTE",
  RESMA: "RESMA",
  ROLO: "ROLO",
  SACO: "SACO",
  SACOLA: "SACOLA",
  TAMBOR: "TAMBOR",
  TANQUE: "TANQUE",
  TONELADA: "TON",
  TUBO: "TUBO",
  UNIDADE: "UNID",
  VASILHA: "VASIL",
  VIDRO: "VIDRO",

  // Variações comuns
  LITROS: "LITRO",
  LT: "LITRO",
  QUILOS: "KG",
  KILOS: "KG",
  METROS: "M",
  MT: "M",
  CAIXAS: "CX",
  UN: "UNID",
  UND: "UNID",
  "UNID.": "UNID",
  PÇ: "PC",
  PEÇAS: "PC",
}

// Cabeçalhos corretos extraídos dos arquivos CSV reais
const EXPECTED_HEADERS: { [key: string]: string[] } = {
  PESSOAS: [
    "CODIGO",
    "NOME",
    "FANTASIA",
    "TIPO_PESSOA",
    "CNPJ_CPF",
    "NUMERO_RG",
    "DATA_EMISSAO_RG",
    "ORGAO_EMISSAO_RG",
    "INSCRICAO_ESTADUAL",
    "INSCRICAO_MUNICIPAL",
    "TIPO_MERCADO",
    "TIPO_ATIVIDADE",
    "BENEFICIO_FISCAL",
    "SUFRAMA",
    "VALIDADE_SUFRAMA",
    "CEP",
    "NUMERO_ENDERECO",
    "COMPLEMENTO_ENDERECO",
    "TELEFONE",
    "EMAIL",
    "DATA_NASCIMENTO",
    "SITUACAO",
    "CONSIDERA_FORNECEDOR",
    "CONSIDERA_CLIENTE",
    "CONSIDERA_REPRESENTANTE",
    "CONSIDERA_TRANSPORTADORA",
    "CONSIDERA_FAVORECIDO",
    "CODIGO_REGIME_TRIBUTARIO",
    "MICRO_EMPRESA",
    "CONTRIBUINTE_ICMS",
    "PESSOA_INDUSTRIA",
    "RAMO_ATIVIDADE",
    "EMAIL_NFE",
  ],
  PRODUTOS: [
    "Código",
    "Descrição",
    "GTIN unidade tributável",
    "Situação",
    "Peso líquido (kg)",
    "Peso bruto (kg)",
    "Comprimento (cm)",
    "Largura (cm)",
    "Altura (cm)",
    "Código da marca",
    "Código da empresa",
    "Código da família",
    "Pode ser vendido",
    "Número do registro na Anvisa",
    "Código da unidade de medida de venda",
    "Código do produto ANP",
    "Descrição do produto conforme ANP",
    "Origem fiscal da mercadoria",
    "Tipo do produto para impostos",
    "Controlar ICMS ST Substituído e FCI Comércio pelo método do estoque PEPS",
    "Especificador de substituição tributária",
    "NCM",
    "Pode ser requisitado",
    "Preço de custo",
    "Código da unidade de medida de estoque",
    "Depósito - Código da filial",
    "Depósito - Código do depósito",
    "Código da unidade de medida auxiliar de estoque",
    "Pode ser comprado",
  ],
  CLIENTE: [
    "EMPRESA",
    "FILIAL",
    "CODIGO_CLIENTE",
    "CONDICAO_PAGAMENTO",
    "REPRESENTANTE",
    "TRANSPORTADORA",
    "CONSUMIDOR_FINAL",
    "SITUACAO",
  ],
  DEPOSITO: [
    "EMPRESA",
    "FILIAL",
    "CODIGO",
    "DESCRICAO",
    "ABREVIATURA",
    "UTILIZA_COMPRA",
    "UTILIZA_VENDA",
    "OBSERVACAO",
    "SITUACAO",
  ],
  CONVERSAO_UNIDADE_MEDIDA: [
    "Código da empresa",
    "Código do produto",
    "Código da pessoa",
    "Código da unidade de medida de origem",
    "Código da unidade de medida de destino",
    "Operador de conversão",
    "Valor para conversão",
  ],
  ENGENHARIAS: [
    "CODIGO_EMPRESA",
    "CODIGO_FILIAL",
    "CODIGO_SKU_PRODUCAO",
    "CODIGO_ROTEIRO",
    "PERCENTUAL_PERDA_SKU_CONSUMO",
    "CODIGO_ESTAGIO",
    "CODIGO_SKU_CONSUMO",
    "QUANTIDADE_SKU_CONSUMO",
    "PERCENTUAL_PERDA_SKU_PRODUCAO",
    "TIPO_MOVIMENTO_SKU_CONSUMO",
    "FATOR_UTILIZACAO_SKU_CONSUMO",
    "LOTE_FREQUENCIAL_SKU_CONSUMO",
    "CODIGO_OPERACAO",
    "CODIGO_RECURSO",
  ],
  PLANO_FINANCEIRO: [
    "codigoconta",
    "classificacao",
    "descricao",
    "abreviatura",
    "codigodotipofinanceiro",
    "analiticasintetica",
    "natureza",
    "nivel",
    "contacontabilvinculada",
  ],
  PLANO_CONTABIL: [
    "codigoconta",
    "classificacao",
    "descricao",
    "abreviatura",
    "definicaodegrupo",
    "analiticasintetica",
    "natureza",
    "nivel",
    "formaderateio",
    "exigecontaauxiliar",
    "aceitalancamentomanual",
  ],
  CENTRO_CUSTO: [
    "codigodocentrodecusto",
    "classificacao",
    "descricao",
    "abreviatura",
    "analiticasintetica",
    "natureza",
    "tipodocentrodecusto",
    "nivel",
  ],
  INFORMACOES_FISCAIS: [
    "EMPRESA",
    "FILIAL",
    "PRODUTO",
    "QUANTIDADE",
    "DATA DE ENTRADA",
    "BASE ICMS",
    "PERCENTUAL ICMS",
    "VALOR ICMS",
    "BASE ICMS ST",
    "PERCENTUAL ICMS ST",
    "VALOR ICMS ST",
    "BASE FCP",
    "PERCENTUAL FCP",
    "VALOR FCP",
    "BASE FCP ST",
    "PERCENTUAL FCP ST",
    "VALOR FCP ST",
    "CÓDIGO DA FCI",
    "ORIGEM DA MERCADORIA",
  ],
  TITULOS_RECEBER: [
    "EMPRESA",
    "FILIAL",
    "NUMERO_TITULO",
    "TIPO_TITULO",
    "CLIENTE",
    "CNPJ_CPF",
    "SACADO",
    "VALOR",
    "FORMA_PAGAMENTO",
    "TRANSACAO",
    "DATA_EMISSAO",
    "DATA_ENTRADA",
    "VENCIMENTO",
    "PRORROGA_JUROS",
    "PERCENTUAL_DESCONTO",
    "VALOR_DESCONTO",
    "PORTADOR",
    "CARTEIRA",
    "TIPO_JUROS",
    "PERCENTUAL_JUROS",
    "PERCENTUAL_MULTA",
    "MOEDA",
    "COTACAO_MOEDA",
    "OBSERVACAO",
    "NUMERO_CHEQUE",
    "NOSSO_NUMERO",
    "CONTA_FINANCEIRA",
    "CENTRO_CUSTO",
  ],
  TITULOS_PAGAR: [
    "EMPRESA",
    "FILIAL",
    "NUMERO_TITULO",
    "TIPO_TITULO",
    "FORNECEDOR",
    "CNPJ_CPF",
    "FAVORECIDO",
    "VALOR",
    "FORMA_PAGAMENTO",
    "TRANSACAO",
    "DATA_EMISSAO",
    "DATA_ENTRADA",
    "VENCIMENTO",
    "PRORROGA_JUROS",
    "PERCENTUAL_DESCONTO",
    "VALOR_DESCONTO",
    "PORTADOR",
    "CARTEIRA",
    "TIPO_JUROS",
    "PERCENTUAL_JUROS",
    "PERCENTUAL_MULTA",
    "MOEDA",
    "COTACAO_MOEDA",
    "OBSERVACAO",
    "CONTA_FINANCEIRA",
    "CENTRO_CUSTO",
  ],
  SITUACAO_NCM: ["Código", "Situação"],
  REPRESENTANTE: [
    "CODIGO_REPRESENTANTE",
    "CODIGO_EMPRESA",
    "CODIGO_FILIAL",
    "CATEGORIA_REPRESENTANTE",
    "VALOR_MIN_PEDIDO",
    "PERC_COMISSAO_PADRAO_PRODUTO",
    "PERC_COMISSAO_PADRAO_SERVICO",
    "PERC_COMISSAO_PAGO_FATURAMENTO",
    "ENCARGOS_NA_BASE_COMISSAO",
    "OUTRAS_DESPESAS_NA_BASE_COMISSAO",
    "VLR_EMBALAGENS_NA_BASE_COMISSAO",
    "SEGURO_NA_BASE_COMISSAO",
    "FRETE_NA_BASE_COMISSAO",
    "IPI_NA_BASE_COMISSAO",
    "ICMS_NA_BASE_COMISSAO",
    "ICMS_SUBS_NA_BASE_COMISSAO",
    "INSS_NA_BASE_COMISSAO",
    "ISS_NA_BASE_COMISSAO",
    "COFINS_FAT_NA_BASE_COMISSAO",
    "COFINS_RET_NA_BASE_COMISSAO",
    "PIS_FAT_NA_BASE_COMISSAO",
    "PIS_RET_NA_BASE_COMISSAO",
    "IRRF_NA_BASE_COMISSAO",
    "CSLL_NA_BASE_COMISSAO",
    "CODIGO_TABELA_PRECO_PADRAO",
    "PERC_COMISSAO_PAGO_REC_TITULO",
    "PAG_COMISSAO_POR_PARCELAS",
  ],
  SALDOS_CONTABEIS: [
    "TIPO",
    "EMPRESA",
    "FILIAL",
    "DATA",
    "PARTIDA",
    "CONTA CONTÁBIL",
    "CENTRO DE CUSTO",
    "CONTA AUXILIAR",
    "VALOR",
  ],
  TABELA_PRECO_VENDA: [
    "TIPO_ITEM",
    "CODIGO",
    "UNIDADE_MEDIDA",
    "CONDICAO_PAGAMENTO",
    "QTD_MAXIMA",
    "VALOR_BASE",
    "PERCENTUAL_DESCONTO",
    "PERCENTUAL_COMISSAO",
    "OBSERVACAO",
  ],
  TABELA_PRECO_COMPRA: [
    "TIPO",
    "COD_ITEM",
    "COD_ITEM_FORNECEDOR",
    "UNIDADE_MEDIDA",
    "COD_CONDICAO_PAGAMENTO",
    "QUANTIDADE_MAXIMA",
    "PRECO_BASE",
    "PERCENTUAL_DESCONTO",
    "OBSERVACAO",
  ],
  SALDO_INICIAL_ESTOQUE: [
    "CODIGO_EMPRESA",
    "CODIGO_FILIAL",
    "CODIGO_PRODUTO",
    "CODIGO_DEPOSITO",
    "CODIGO_TRANSACAO_ESTOQUE",
    "QUANTIDADE",
    "VALOR",
    "NUMERO_SERIE",
    "CODIGO_LOTE",
    "DATA_FABRICACAO_LOTE_SERIE",
    "DATA_VALIDADE_LOTE_SERIE",
  ],
  SERVICO: [
    "EMPRESA",
    "FAMILIA",
    "CODIGO",
    "DESCRICAO",
    "COMPLEMENTO",
    "CODIGO_UNIDADE_MEDIDA",
    "QUANTIDADE_PADRAO",
    "FILIAL",
    "TRANSPORTADORA",
    "TIPO_ENERGIA",
    "TENSAO",
    "CLASSE_CONSUMIDORA_ENERGIA",
    "CLASSE_CONSUMIDORA_AGUA",
    "CATEGORIA_MANUTENCAO",
    "NATUREZA_GASTO",
    "PRECO_UNITARIO",
    "SITUACAO",
    "TIPO_SERVICO_LC",
    "NOMENCLATURA_BRASILEIRA",
    "CODIGO_ATIVIDADE",
    "ORIGEM_FISCAL_MERCADORIA",
    "ESPECIFICADOR_SUB_TRIBUTARIA",
    "NCM",
    "DESCRICAO_IMPRESSAO_NOTA_FISCAL",
    "TIPO_SERVICO_COMERCIO",
    "PERC_DESCONTO_PREVISTO_VENDA",
    "PERC_COMISSAO_PREVISTO_VENDA",
  ],
}

// Templates de arquivos CSV para download
const CSV_TEMPLATES: { [key: string]: string } = {
  PESSOAS: `CODIGO;NOME;FANTASIA;TIPO_PESSOA;CNPJ_CPF;NUMERO_RG;DATA_EMISSAO_RG;ORGAO_EMISSAO_RG;INSCRICAO_ESTADUAL;INSCRICAO_MUNICIPAL;TIPO_MERCADO;TIPO_ATIVIDADE;BENEFICIO_FISCAL;SUFRAMA;VALIDADE_SUFRAMA;CEP;NUMERO_ENDERECO;COMPLEMENTO_ENDERECO;TELEFONE;EMAIL;DATA_NASCIMENTO;SITUACAO;CONSIDERA_FORNECEDOR;CONSIDERA_CLIENTE;CONSIDERA_REPRESENTANTE;CONSIDERA_TRANSPORTADORA;CONSIDERA_FAVORECIDO;CODIGO_REGIME_TRIBUTARIO;MICRO_EMPRESA;CONTRIBUINTE_ICMS;PESSOA_INDUSTRIA;RAMO_ATIVIDADE;EMAIL_NFE
1;João Silva;João Silva ME;FISICA;12345678901;123456789;01-01-2000;SSP;123456789;987654321;INTERNO;COMERCIO;NAO_POSSUI;;01-01-2025;12345678;Rua A, 123;Apto 1;11999999999;joao@email.com;01-01-1980;ATIVO;SIM;SIM;NAO;NAO;NAO;SIMPLES;ME_EPP;SIM;NAO;12345;joao@nfe.com`,

  PRODUTOS: `Código;Descrição;GTIN unidade tributável;Situação;Peso líquido (kg);Peso bruto (kg);Comprimento (cm);Largura (cm);Altura (cm);Código da marca;Código da empresa;Código da família;Pode ser vendido;Número do registro na Anvisa;Código da unidade de medida de venda;Código do produto ANP;Descrição do produto conforme ANP;Origem fiscal da mercadoria;Tipo do produto para impostos;Controlar ICMS ST Substituído e FCI Comércio pelo método do estoque PEPS;Especificador de substituição tributária;NCM;Pode ser requisitado;Preço de custo;Código da unidade de medida de estoque;Depósito - Código da filial;Depósito - Código do depósito;Código da unidade de medida auxiliar de estoque;Pode ser comprado
PROD001;Produto Exemplo;12345678901234;ATIVO;1.5;2.0;10.0;5.0;3.0;MARCA1;1;1;SIM;123456789;UNID;123456789;Produto ANP;0;MERCADORIAS;NAO;1234567;12345678;SIM;100.50;UNID;1;DEP001;UNID;SIM`,

  CLIENTE: `EMPRESA;FILIAL;CODIGO_CLIENTE;CONDICAO_PAGAMENTO;REPRESENTANTE;TRANSPORTADORA;CONSUMIDOR_FINAL;SITUACAO
1;1;1;VISTA;1;1;SIM;ATIVO`,

  DEPOSITO: `EMPRESA;FILIAL;CODIGO;DESCRICAO;ABREVIATURA;UTILIZA_COMPRA;UTILIZA_VENDA;OBSERVACAO;SITUACAO
1;1;DEP001;Depósito Principal;DEP01;SIM;SIM;Depósito principal da empresa;ATIVO`,

  CONVERSAO_UNIDADE_MEDIDA: `Código da empresa;Código do produto;Código da pessoa;Código da unidade de medida de origem;Código da unidade de medida de destino;Operador de conversão;Valor para conversão
1;PROD001;;UNID;CX;MULTIPLICAR;12`,

  ENGENHARIAS: `CODIGO_EMPRESA;CODIGO_FILIAL;CODIGO_SKU_PRODUCAO;CODIGO_ROTEIRO;PERCENTUAL_PERDA_SKU_CONSUMO;CODIGO_ESTAGIO;CODIGO_SKU_CONSUMO;QUANTIDADE_SKU_CONSUMO;PERCENTUAL_PERDA_SKU_PRODUCAO;TIPO_MOVIMENTO_SKU_CONSUMO;FATOR_UTILIZACAO_SKU_CONSUMO;LOTE_FREQUENCIAL_SKU_CONSUMO;CODIGO_OPERACAO;CODIGO_RECURSO
1;1;PROD001;ROT001;5.0;EST001;MAT001;2.5;3.0;AUTOMATICO;PROPORCIONAL;100;OP001;REC001`,

  PLANO_FINANCEIRO: `codigoconta;classificacao;descricao;abreviatura;codigodotipofinanceiro;analiticasintetica;natureza;nivel;contacontabilvinculada
1;1;RESULTADO;RESULTADO;2;SINTETICA;CREDORA;1;`,

  PLANO_CONTABIL: `codigoconta;classificacao;descricao;abreviatura;definicaodegrupo;analiticasintetica;natureza;nivel;formaderateio;exigecontaauxiliar;aceitalancamentomanual
1;1;ATIVO;ATIVO;ATIVO;SINTETICA;DEVEDORA;1;SEM_RATEIO;NAO;SIM`,

  CENTRO_CUSTO: `codigodocentrodecusto;classificacao;descricao;abreviatura;analiticasintetica;natureza;tipodocentrodecusto;nivel
1;1;ADMINISTRATIVO;ADM;SINTETICA;DEVEDORA;ADMINISTRATIVO;1`,

  INFORMACOES_FISCAIS: `EMPRESA;FILIAL;PRODUTO;QUANTIDADE;DATA DE ENTRADA;BASE ICMS;PERCENTUAL ICMS;VALOR ICMS;BASE ICMS ST;PERCENTUAL ICMS ST;VALOR ICMS ST;BASE FCP;PERCENTUAL FCP;VALOR FCP;BASE FCP ST;PERCENTUAL FCP ST;VALOR FCP ST;CÓDIGO DA FCI;ORIGEM DA MERCADORIA
1;1;PROD001;100.00000;01/01/2024 10:00:00;1000.00;18.0000;180.00;1000.00;18.0000;180.00;1000.00;2.0000;20.00;1000.00;2.0000;20.00;12345678-1234-1234-1234-123456789012;0`,
  TITULOS_RECEBER: `EMPRESA;FILIAL;NUMERO_TITULO;TIPO_TITULO;CLIENTE;CNPJ_CPF;SACADO;VALOR;FORMA_PAGAMENTO;TRANSACAO;DATA_EMISSAO;DATA_ENTRADA;VENCIMENTO;PRORROGA_JUROS;PERCENTUAL_DESCONTO;VALOR_DESCONTO;PORTADOR;CARTEIRA;TIPO_JUROS;PERCENTUAL_JUROS;PERCENTUAL_MULTA;MOEDA;COTACAO_MOEDA;OBSERVACAO;NUMERO_CHEQUE;NOSSO_NUMERO;CONTA_FINANCEIRA;CENTRO_CUSTO
1;1;D/202308031651;NFV;1;;;1234.56;;90300;10/09/2024;10/09/2024;16/09/2024;;;;999;99;;;;BRL;;INCLUSO PELA CARGA INICIAL;;;1032;1201`,

  TITULOS_PAGAR: `EMPRESA;FILIAL;NUMERO_TITULO;TIPO_TITULO;FORNECEDOR;CNPJ_CPF;FAVORECIDO;VALOR;FORMA_PAGAMENTO;TRANSACAO;DATA_EMISSAO;DATA_ENTRADA;VENCIMENTO;PRORROGA_JUROS;PERCENTUAL_DESCONTO;VALOR_DESCONTO;PORTADOR;CARTEIRA;TIPO_JUROS;PERCENTUAL_JUROS;PERCENTUAL_MULTA;MOEDA;COTACAO_MOEDA;OBSERVACAO;CONTA_FINANCEIRA;CENTRO_CUSTO
1;1;1009244;NFC;4;;;1234.56;;90500;10/09/2024;10/09/2024;15/09/2024;;;;9999;99;;;;BRL;;TESTE INTEGRACAO;2040;1101`,

  SITUACAO_NCM: `Código;Situação
12345678;ATIVO`,

  REPRESENTANTE: `CODIGO_REPRESENTANTE;CODIGO_EMPRESA;CODIGO_FILIAL;CATEGORIA_REPRESENTANTE;VALOR_MIN_PEDIDO;PERC_COMISSAO_PADRAO_PRODUTO;PERC_COMISSAO_PADRAO_SERVICO;PERC_COMISSAO_PAGO_FATURAMENTO;ENCARGOS_NA_BASE_COMISSAO;OUTRAS_DESPESAS_NA_BASE_COMISSAO;VLR_EMBALAGENS_NA_BASE_COMISSAO;SEGURO_NA_BASE_COMISSAO;FRETE_NA_BASE_COMISSAO;IPI_NA_BASE_COMISSAO;ICMS_NA_BASE_COMISSAO;ICMS_SUBS_NA_BASE_COMISSAO;INSS_NA_BASE_COMISSAO;ISS_NA_BASE_COMISSAO;COFINS_FAT_NA_BASE_COMISSAO;COFINS_RET_NA_BASE_COMISSAO;PIS_FAT_NA_BASE_COMISSAO;PIS_RET_NA_BASE_COMISSAO;IRRF_NA_BASE_COMISSAO;CSLL_NA_BASE_COMISSAO;CODIGO_TABELA_PRECO_PADRAO;PERC_COMISSAO_PAGO_REC_TITULO;PAG_COMISSAO_POR_PARCELAS
1;1;1;REPRESENTANTE;10;10;10;60;SIM;SIM;SIM;SIM;SIM;SIM;SIM;SIM;SIM;SIM;SIM;SIM;SIM;SIM;SIM;SIM;1;40;PRIMEIRA`,

  SALDOS_CONTABEIS: `TIPO;EMPRESA;FILIAL;DATA;PARTIDA;CONTA CONTÁBIL;CENTRO DE CUSTO;CONTA AUXILIAR;VALOR
DEBITO;1;1;01/01/2024;1;1101;1001;;1000.00`,

  TABELA_PRECO_VENDA: `TIPO_ITEM;CODIGO;UNIDADE_MEDIDA;CONDICAO_PAGAMENTO;QTD_MAXIMA;VALOR_BASE;PERCENTUAL_DESCONTO;PERCENTUAL_COMISSAO;OBSERVACAO
VP;02.06;UNID;;;384;;;`,

  TABELA_PRECO_COMPRA: `TIPO;COD_ITEM;COD_ITEM_FORNECEDOR;UNIDADE_MEDIDA;COD_CONDICAO_PAGAMENTO;QUANTIDADE_MAXIMA;PRECO_BASE;PERCENTUAL_DESCONTO;OBSERVACAO
VP;PROD001;FORN001;UNID;VISTA;100;50.00;5.00;Produto exemplo`,

  SALDO_INICIAL_ESTOQUE: `CODIGO_EMPRESA;CODIGO_FILIAL;CODIGO_PRODUTO;CODIGO_DEPOSITO;CODIGO_TRANSACAO_ESTOQUE;QUANTIDADE;VALOR;NUMERO_SERIE;CODIGO_LOTE;DATA_FABRICACAO_LOTE_SERIE;DATA_VALIDADE_LOTE_SERIE
1;1;PROD001;DEP001;EST001;100.00000;5000.00;;;;`,

  SERVICO: `EMPRESA;FAMILIA;CODIGO;DESCRICAO;COMPLEMENTO;CODIGO_UNIDADE_MEDIDA;QUANTIDADE_PADRAO;FILIAL;TRANSPORTADORA;TIPO_ENERGIA;TENSAO;CLASSE_CONSUMIDORA_ENERGIA;CLASSE_CONSUMIDORA_AGUA;CATEGORIA_MANUTENCAO;NATUREZA_GASTO;PRECO_UNITARIO;SITUACAO;TIPO_SERVICO_LC;NOMENCLATURA_BRASILEIRA;CODIGO_ATIVIDADE;ORIGEM_FISCAL_MERCADORIA;ESPECIFICADOR_SUB_TRIBUTARIA;NCM;DESCRICAO_IMPRESSAO_NOTA_FISCAL;TIPO_SERVICO_COMERCIO;PERC_DESCONTO_PREVISTO_VENDA;PERC_COMISSAO_PREVISTO_VENDA
1;SER;ERP-0006;Rodar Bem;;UNID;0;0;0;;;;;;0;0;ATIVO;01.01;101021100;1234567;1;1234567;0;descricao;SERVICO;10;10`,
}

// Utilitários
function onlyNumbers(text: string): string {
  return text.replace(/[^0-9]/g, "")
}

function preencherZeros(valor: string, tamanho: number): string {
  const numeros = onlyNumbers(valor)
  return numeros.padStart(tamanho, "0")
}

function removeSpecialChars(text: string): string {
  return text.replace(/[^a-zA-Z0-9\s]/g, "")
}

function formatDecimal(value: string, casasDecimais = 2): string {
  if (!value || value.trim() === "") return ""

  // Remove tudo exceto números, vírgula e ponto
  let cleaned = value.replace(/[^0-9.,]/g, "")

  // Substitui vírgula por ponto
  cleaned = cleaned.replace(",", ".")

  // Se tem mais de um ponto, mantém apenas o último
  const parts = cleaned.split(".")
  if (parts.length > 2) {
    cleaned = parts[0] + "." + parts.slice(1).join("")
  }

  // Limita casas decimais
  if (cleaned.includes(".")) {
    const [inteira, decimal] = cleaned.split(".")
    cleaned = inteira + "." + decimal.substring(0, casasDecimais)
  }

  return cleaned
}

function validateNumericRange(value: string, min: number, max: number): boolean {
  const num = Number.parseFloat(value)
  return !isNaN(num) && num >= min && num <= max
}

function correctUnidadeMedida(value: string): string {
  if (!value || value.trim() === "") return ""

  const upperValue = value.toUpperCase().trim()

  // Se já é um código válido, retorna
  if (Object.keys(UNIDADE_MEDIDA_MAP).includes(upperValue)) {
    return upperValue
  }

  // Busca pela descrição para encontrar o código
  for (const [code, description] of Object.entries(UNIDADE_MEDIDA_MAP)) {
    if (description.toUpperCase() === upperValue) {
      return code
    }
  }

  // Busca parcial
  for (const [code, description] of Object.entries(UNIDADE_MEDIDA_MAP)) {
    if (description.toUpperCase().includes(upperValue) || upperValue.includes(description.toUpperCase())) {
      return code
    }
  }

  return value // Retorna original se não encontrar
}

// Validação de cabeçalho - versão mais flexível
function validateHeaders(headers: string[], subject: string): { isValid: boolean; message?: string } {
  const expectedHeaders = EXPECTED_HEADERS[subject]
  if (!expectedHeaders) {
    return { isValid: false, message: `Assunto ${subject} não configurado` }
  }

  // Normaliza os cabeçalhos para comparação (remove espaços, acentos, etc.)
  const normalizeHeader = (header: string) =>
    header
      .trim()
      .toLowerCase()
      .replace(/[áàâãä]/g, "a")
      .replace(/[éèêë]/g, "e")
      .replace(/[íìîï]/g, "i")
      .replace(/[óòôõö]/g, "o")
      .replace(/[úùûü]/g, "u")
      .replace(/[ç]/g, "c")

  const normalizedExpected = expectedHeaders.map(normalizeHeader)
  const normalizedActual = headers.map(normalizeHeader)

  // Verifica se pelo menos 70% dos cabeçalhos esperados estão presentes
  const matchingHeaders = normalizedActual.filter((h) => normalizedExpected.includes(h))
  const matchPercentage = (matchingHeaders.length / normalizedExpected.length) * 100

  console.log("Headers validation:", {
    subject,
    expected: expectedHeaders.length,
    actual: headers.length,
    matching: matchingHeaders.length,
    percentage: matchPercentage,
  })

  if (matchPercentage < 70) {
    return {
      isValid: false,
      message: `Cabeçalhos não correspondem ao assunto ${subject}. Encontrados ${matchingHeaders.length} de ${expectedHeaders.length} cabeçalhos esperados (${matchPercentage.toFixed(1)}%). Verifique se selecionou o assunto correto.`,
    }
  }

  return { isValid: true }
}

// Validação de campos obrigatórios
function validateRequiredFields(
  row: string[],
  headers: string[],
  subject: string,
): { isValid: boolean; missingFields: string[] } {
  const requiredFields = getRequiredFields(subject)
  const missingFields: string[] = []

  requiredFields.forEach((field) => {
    const index = headers.indexOf(field)
    if (index >= 0 && (!row[index] || row[index].trim() === "")) {
      missingFields.push(field)
    }
  })

  return { isValid: missingFields.length === 0, missingFields }
}

function getRequiredFields(subject: string): string[] {
  const requiredFieldsMap: { [key: string]: string[] } = {
    PESSOAS: ["CODIGO", "NOME", "FANTASIA", "TIPO_PESSOA", "SITUACAO", "CODIGO_REGIME_TRIBUTARIO"],
    PRODUTOS: ["Código", "Descrição", "Situação", "Código da empresa", "Código da família"],
    INFORMACOES_FISCAIS: [
      "EMPRESA",
      "FILIAL",
      "PRODUTO",
      "QUANTIDADE",
      "DATA DE ENTRADA",
      "BASE ICMS",
      "PERCENTUAL ICMS",
      "VALOR ICMS",
      "BASE ICMS ST",
      "PERCENTUAL ICMS ST",
      "VALOR ICMS ST",
      "BASE FCP",
      "PERCENTUAL FCP",
      "VALOR FCP",
      "BASE FCP ST",
      "PERCENTUAL FCP ST",
      "VALOR FCP ST",
    ],
    CLIENTE: ["EMPRESA", "FILIAL", "CODIGO_CLIENTE", "SITUACAO"],
    CONVERSAO_UNIDADE_MEDIDA: [
      "Código da empresa",
      "Código do produto",
      "Código da pessoa",
      "Código da unidade de medida de origem",
      "Código da unidade de medida de destino",
      "Operador de conversão",
      "Valor para conversão",
    ],
    DEPOSITO: [
      "EMPRESA",
      "FILIAL",
      "CODIGO",
      "DESCRICAO",
      "ABREVIATURA",
      "UTILIZA_COMPRA",
      "UTILIZA_VENDA",
      "SITUACAO",
    ],
    ENGENHARIAS: ["CODIGO_EMPRESA", "CODIGO_FILIAL", "CODIGO_SKU_PRODUCAO", "CODIGO_ESTAGIO"],
    PLANO_FINANCEIRO: [
      "codigoconta",
      "classificacao",
      "descricao",
      "abreviatura",
      "codigodotipofinanceiro",
      "analiticasintetica",
      "natureza",
      "nivel",
    ],
    PLANO_CONTABIL: [
      "codigoconta",
      "classificacao",
      "descricao",
      "abreviatura",
      "definicaodegrupo",
      "analiticasintetica",
      "natureza",
      "nivel",
      "formaderateio",
      "exigecontaauxiliar",
      "aceitalancamentomanual",
    ],
    CENTRO_CUSTO: [
      "codigodocentrodecusto",
      "classificacao",
      "descricao",
      "abreviatura",
      "analiticasintetica",
      "natureza",
      "tipodocentrodecusto",
      "nivel",
    ],
    TITULOS_RECEBER: [
      "EMPRESA",
      "FILIAL",
      "NUMERO_TITULO",
      "TIPO_TITULO",
      "VALOR",
      "TRANSACAO",
      "DATA_EMISSAO",
      "DATA_ENTRADA",
      "VENCIMENTO",
      "PORTADOR",
      "CARTEIRA",
      "OBSERVACAO",
    ],
    TITULOS_PAGAR: [
      "EMPRESA",
      "FILIAL",
      "NUMERO_TITULO",
      "TIPO_TITULO",
      "VALOR",
      "TRANSACAO",
      "DATA_EMISSAO",
      "DATA_ENTRADA",
      "VENCIMENTO",
      "PORTADOR",
      "CARTEIRA",
      "OBSERVACAO",
    ],
    SITUACAO_NCM: ["Código", "Situação"],
    REPRESENTANTE: ["CODIGO_REPRESENTANTE", "CODIGO_EMPRESA", "CODIGO_FILIAL", "CATEGORIA_REPRESENTANTE"],
    SALDOS_CONTABEIS: ["TIPO", "EMPRESA", "FILIAL", "DATA", "CONTA CONTÁBIL", "VALOR"],
    TABELA_PRECO_VENDA: ["TIPO_ITEM", "CODIGO", "UNIDADE_MEDIDA", "VALOR_BASE"],
    TABELA_PRECO_COMPRA: ["TIPO", "COD_ITEM", "UNIDADE_MEDIDA", "PRECO_BASE"],
    SALDO_INICIAL_ESTOQUE: [
      "CODIGO_EMPRESA",
      "CODIGO_FILIAL",
      "CODIGO_PRODUTO",
      "CODIGO_DEPOSITO",
      "QUANTIDADE",
      "VALOR",
    ],
    SERVICO: ["EMPRESA", "FAMILIA", "CODIGO", "DESCRICAO", "CODIGO_UNIDADE_MEDIDA", "SITUACAO"],
  }

  return requiredFieldsMap[subject] || []
}

// Processamento específico para Pessoas
function tratarPessoas(data: string[][]): { data: string[][]; corrections: any[]; invalidRows: any[] } {
  const corrections: any[] = []
  const invalidRows: any[] = []
  const headers = data[0]
  const processedData = [headers]

  for (let i = 1; i < data.length; i++) {
    const row = [...data[i]]
    const originalRow = [...data[i]]

    // Validar campos obrigatórios
    const validation = validateRequiredFields(row, headers, "PESSOAS")
    if (!validation.isValid) {
      invalidRows.push({
        row: i + 1,
        data: originalRow,
        missingFields: validation.missingFields,
      })
      continue
    }

    headers.forEach((header, colIndex) => {
      const originalValue = row[colIndex] || ""
      let newValue = originalValue.trim()

      switch (header) {
        case "CODIGO":
          newValue = onlyNumbers(originalValue).substring(0, 9)
          break

        case "NOME":
          newValue = removeSpecialChars(originalValue).substring(0, 100)
          break

        case "FANTASIA":
          newValue = removeSpecialChars(originalValue).substring(0, 50)
          break

        case "TIPO_PESSOA":
          const tipoPessoa = originalValue.toUpperCase().trim()
          if (["PF", "CPF", "FISICA", "FÍSICA", "FIS", "FISICO", "PESSOA FISICA"].includes(tipoPessoa)) {
            newValue = "FISICA"
          } else if (
            ["PJ", "JURIDICA", "JURÍDICA", "JUR", "JURIDICO", "CNPJ", "PESSOA JURIDICA"].includes(tipoPessoa)
          ) {
            newValue = "JURIDICA"
          } else {
            newValue = "FISICA"
          }
          break

        case "CNPJ_CPF":
          const numeros = onlyNumbers(originalValue)
          const tipoIndex = headers.indexOf("TIPO_PESSOA")
          const tipo = tipoIndex >= 0 ? row[tipoIndex] : "FISICA"
          if (numeros) {
            newValue = tipo === "FISICA" ? numeros.padStart(11, "0") : numeros.padStart(14, "0")
          }
          break

        case "TIPO_MERCADO":
          const tipoMercado = originalValue.toUpperCase().trim()
          if (
            tipoMercado === "I" ||
            tipoMercado.startsWith("INT") ||
            tipoMercado === "NACIONAL" ||
            tipoMercado === "BRASIL"
          ) {
            newValue = "INTERNO"
          } else if (
            tipoMercado === "E" ||
            tipoMercado === "EX" ||
            tipoMercado.startsWith("EXT") ||
            tipoMercado === "INTERNACIONAL"
          ) {
            newValue = "EXTERNO"
          } else {
            newValue = "INTERNO"
          }
          break

        case "CEP":
          newValue = preencherZeros(originalValue, 8)
          break

        case "TELEFONE":
          newValue = onlyNumbers(originalValue).substring(0, 11)
          break

        case "EMAIL":
          if (originalValue && typeof originalValue === "string") {
            newValue = originalValue.split(",")[0].trim().substring(0, 100).toLowerCase()
          }
          break

        case "SITUACAO":
          const situacao = originalValue.toUpperCase().trim()
          newValue = ["ATIVO", "SIM", "NORMAL", "A", "S"].includes(situacao) ? "ATIVO" : "INATIVO"
          break

        case "CONSIDERA_FORNECEDOR":
        case "CONSIDERA_CLIENTE":
        case "CONSIDERA_REPRESENTANTE":
        case "CONSIDERA_TRANSPORTADORA":
        case "CONSIDERA_FAVORECIDO":
        case "CONTRIBUINTE_ICMS":
        case "PESSOA_INDUSTRIA":
          const considera = originalValue.toUpperCase().trim()
          if (["SIM", "S", "YES", "TRUE", "ATIVO", "PODE", "1"].includes(considera)) {
            newValue = "SIM"
          } else if (["NAO", "NÃO", "N", "NO", "FALSE", "INATIVO", "NAO PODE", "NÃO PODE", "0"].includes(considera)) {
            newValue = "NÃO"
          } else {
            newValue = "NÃO"
          }
          break

        case "CODIGO_REGIME_TRIBUTARIO":
          const regime = originalValue.toUpperCase().trim()
          if (["SIMPLES", "MICROEMPRESA", "MICROEMPRESARIO", "MEI", "SIMPLES NACIONAL"].includes(regime)) {
            newValue = "SIMPLES"
          } else if (["NORMAL", "REAL", "LUCRO REAL"].includes(regime)) {
            newValue = "NORMAL"
          } else if (regime.includes("EXCESSO")) {
            newValue = "SIMPLES_EXCESSO_SUBLIMITE"
          } else if (regime.includes("ESPECIAL")) {
            newValue = "REGIME_ESPECIAL_TRIBUTACAO"
          } else {
            newValue = "NORMAL"
          }
          break

        case "NUMERO_ENDERECO":
          // Aceita apenas números
          newValue = onlyNumbers(originalValue)
          break

        case "COMPLEMENTO_ENDERECO":
          newValue = originalValue.substring(0, 200)
          break

        case "ORGAO_EMISSAO_RG":
          newValue = originalValue.substring(0, 6)
          break

        case "INSCRICAO_ESTADUAL":
          newValue = originalValue.substring(0, 25)
          break

        case "INSCRICAO_MUNICIPAL":
          newValue = originalValue.substring(0, 16)
          break

        case "SUFRAMA":
          newValue = originalValue.substring(0, 10)
          break

        case "RAMO_ATIVIDADE":
          newValue = originalValue.substring(0, 5)
          break

        case "EMAIL":
        case "EMAIL_NFE":
          if (originalValue && originalValue.trim()) {
            // Pega apenas o primeiro email se houver múltiplos
            const emails = originalValue.split(/[;,\s]+/).filter((e) => e.trim() !== "")
            newValue = emails[0] ? emails[0].trim().toLowerCase() : ""
          }
          break

        case "TIPO_ATIVIDADE":
          const atividade = originalValue.toUpperCase().trim()
          const atividadeMap: { [key: string]: string } = {
            OUTROS: "OUTROS",
            PRESTADOR: "PRESTADOR_SERVICO",
            SERVIÇO: "PRESTADOR_SERVICO",
            SERVICO: "PRESTADOR_SERVICO",
            COOPERATIVO: "COOPERATIVA",
            COMERCIO: "COMERCIO",
            IND: "INDUSTRIA",
            INDUSTRIA: "INDUSTRIA",
            INDUSTRIAL: "INDUSTRIA",
            DISTRIBUIDOR: "DISTRIBUIDOR",
            TRR: "TRR",
            EXTRACAO: "EXTRACAO_MINERAL_OUTROS",
            TRANSPORTE: "INDUSTRIA_TRANSPORTE",
            RURAL: "PRODUTOR_RURAL",
            FINANCEIRA: "ATIVIDADE_FINANCEIRA",
            IMOBILIARIA: "ATIVIDADE_IMOBILIARIA",
            COOPERATIVA: "COOPERATIVA",
            SEGUROS: "SOCIEDADE_SEGURADORAS",
            ENERGIA: "DISTRIBUIDOR_ENERGIA",
            COMUNICACAO: "PRESTADOR_SERVICO_COMUNICACAO",
          }

          for (const [key, value] of Object.entries(atividadeMap)) {
            if (atividade.includes(key)) {
              newValue = value
              break
            }
          }
          break
      }

      if (newValue !== originalValue) {
        corrections.push({
          row: i + 1,
          column: header,
          before: originalValue,
          after: newValue,
          reason: `Valor alterado de "${originalValue}" para "${newValue}" para padronização`,
        })
      }

      row[colIndex] = newValue
    })

    processedData.push(row)
  }

  return { data: processedData, corrections, invalidRows }
}

// Processamento específico para Produtos
function tratarProdutos(data: string[][]): { data: string[][]; corrections: any[]; invalidRows: any[] } {
  const corrections: any[] = []
  const invalidRows: any[] = []
  const headers = data[0]
  const processedData = [headers]

  for (let i = 1; i < data.length; i++) {
    const row = [...data[i]]
    const originalRow = [...data[i]]

    // Validar campos obrigatórios
    const validation = validateRequiredFields(row, headers, "PRODUTOS")
    if (!validation.isValid) {
      invalidRows.push({
        row: i + 1,
        data: originalRow,
        missingFields: validation.missingFields,
      })
      continue
    }

    headers.forEach((header, colIndex) => {
      const originalValue = row[colIndex] || ""
      let newValue = originalValue.trim()

      switch (header) {
        case "Código":
          newValue = originalValue.substring(0, 23)
          break

        case "Descrição":
          newValue = originalValue.substring(0, 120)
          break

        case "GTIN unidade tributável":
          newValue = onlyNumbers(originalValue).substring(0, 14)
          if (newValue && newValue.length < 14) {
            newValue = newValue.padStart(14, "0")
          }
          break

        case "Situação":
          const situacao = originalValue.toUpperCase().trim()
          newValue = ["ATIVO", "SIM", "NORMAL", "A"].includes(situacao) ? "ATIVO" : "INATIVO"
          break

        case "Código da empresa":
          newValue = onlyNumbers(originalValue).substring(0, 4)
          break

        case "Código da família":
          newValue = onlyNumbers(originalValue).substring(0, 6)
          break

        case "Pode ser vendido":
        case "Pode ser requisitado":
        case "Pode ser comprado":
          const pode = originalValue.toUpperCase().trim()
          if (["SIM", "S", "YES", "TRUE", "1", "PODE"].includes(pode)) {
            newValue = "SIM"
          } else if (["NAO", "NÃO", "N", "NO", "FALSE", "0", "NAO PODE", "NÃO PODE"].includes(pode)) {
            newValue = "NÃO"
          } else {
            newValue = "NÃO"
          }
          break

        case "Controlar ICMS ST Substituído e FCI Comércio pelo método do estoque PEPS":
          const controlar = originalValue.toUpperCase().trim()
          if (["SIM", "S", "YES", "TRUE", "1"].includes(controlar)) {
            newValue = "SIM"
          } else if (["NAO", "NÃO", "N", "NO", "FALSE", "0"].includes(controlar)) {
            newValue = "NÃO"
          } else {
            newValue = "NÃO"
          }
          break

        case "Origem fiscal da mercadoria":
          const origem = originalValue.trim().toUpperCase()
          if (["NACIONAL", "BRASIL", "BR", "0", "INTERNO", "DOMESTICO"].includes(origem)) {
            newValue = "0"
          } else if (
            ["ESTRANGEIRA", "IMPORTADO", "EXTERIOR", "1", "EXTERNO", "FORA", "IMPORTACAO", "INTERNACIONAL"].includes(
              origem,
            )
          ) {
            newValue = "1"
          } else {
            const num = onlyNumbers(originalValue)
            newValue = num && Number.parseInt(num) <= 8 ? num : "0"
          }
          break

        case "NCM":
          newValue = preencherZeros(originalValue, 8)
          break

        case "Especificador de substituição tributária":
          const especificador = onlyNumbers(originalValue)
          newValue = especificador ? especificador.padStart(7, "0") : ""
          break

        case "Preço de custo":
          if (originalValue && originalValue.trim() !== "" && originalValue.toUpperCase() !== "N/A") {
            const preco = formatDecimal(originalValue, 5)
            if (validateNumericRange(preco, 0, 999999999.99999)) {
              newValue = preco
            } else {
              newValue = "" // Remove valores inválidos
            }
          } else {
            newValue = "" // Remove N/A e valores vazios
          }
          break

        case "Código da unidade de medida de venda":
        case "Código da unidade de medida de estoque":
        case "Código da unidade de medida auxiliar de estoque":
          if (originalValue && originalValue.trim() !== "") {
            newValue = correctUnidadeMedida(originalValue)
          } else {
            newValue = "" // Não auto-completar se estiver vazio
          }
          break

        case "Código da marca":
          newValue = originalValue.substring(0, 10)
          break

        case "Número do registro na Anvisa":
          newValue = originalValue.substring(0, 13)
          break

        case "Código do produto ANP":
          newValue = onlyNumbers(originalValue).substring(0, 19)
          break

        case "Descrição do produto conforme ANP":
          newValue = originalValue.substring(0, 95)
          break

        case "Depósito - Código da filial":
          newValue = onlyNumbers(originalValue).substring(0, 4)
          break

        case "Depósito - Código do depósito":
          newValue = originalValue.substring(0, 10)
          break

        case "Peso líquido (kg)":
        case "Peso bruto (kg)":
        case "Comprimento (cm)":
        case "Largura (cm)":
        case "Altura (cm)":
          newValue = formatDecimal(originalValue, 5)
          if (!validateNumericRange(newValue, 0, 999999.99999)) {
            newValue = ""
          }
          break
      }

      if (newValue !== originalValue) {
        corrections.push({
          row: i + 1,
          column: header,
          before: originalValue,
          after: newValue,
          reason: `Valor alterado de "${originalValue}" para "${newValue}" para padronização`,
        })
      }

      row[colIndex] = newValue
    })

    processedData.push(row)
  }

  return { data: processedData, corrections, invalidRows }
}

// Processamento para Informações Fiscais (PEPS)
function tratarInformacoesFiscais(data: string[][]): { data: string[][]; corrections: any[]; invalidRows: any[] } {
  const corrections: any[] = []
  const invalidRows: any[] = []
  const headers = data[0]
  const processedData = [headers]

  for (let i = 1; i < data.length; i++) {
    const row = [...data[i]]
    const originalRow = [...data[i]]

    const validation = validateRequiredFields(row, headers, "INFORMACOES_FISCAIS")
    if (!validation.isValid) {
      invalidRows.push({
        row: i + 1,
        data: originalRow,
        missingFields: validation.missingFields,
      })
      continue
    }

    headers.forEach((header, colIndex) => {
      const originalValue = row[colIndex] || ""
      let newValue = originalValue.trim()

      switch (header) {
        case "EMPRESA":
        case "FILIAL":
          newValue = onlyNumbers(originalValue)
          if (!validateNumericRange(newValue, 1, 9999)) {
            newValue = "1"
          }
          break

        case "PRODUTO":
          newValue = originalValue.substring(0, 23)
          break

        case "QUANTIDADE":
          newValue = formatDecimal(originalValue, 5)
          break

        case "BASE ICMS":
        case "VALOR ICMS":
        case "BASE ICMS ST":
        case "VALOR ICMS ST":
        case "BASE FCP":
        case "VALOR FCP":
        case "BASE FCP ST":
        case "VALOR FCP ST":
          newValue = formatDecimal(originalValue, 2)
          break

        case "PERCENTUAL ICMS":
        case "PERCENTUAL ICMS ST":
        case "PERCENTUAL FCP":
        case "PERCENTUAL FCP ST":
          newValue = formatDecimal(originalValue, 4)
          break

        case "CÓDIGO DA FCI":
          newValue = originalValue.substring(0, 36)
          break

        case "ORIGEM DA MERCADORIA":
          const origem = onlyNumbers(originalValue)
          newValue = origem && Number.parseInt(origem) <= 8 ? origem : "0"
          break
      }

      if (newValue !== originalValue) {
        corrections.push({
          row: i + 1,
          column: header,
          before: originalValue,
          after: newValue,
          reason: `Valor alterado de "${originalValue}" para "${newValue}" para padronização`,
        })
      }

      row[colIndex] = newValue
    })

    processedData.push(row)
  }

  return { data: processedData, corrections, invalidRows }
}

function tratarGenerico(
  data: string[][],
  subject: string,
): { data: string[][]; corrections: any[]; invalidRows: any[] } {
  const corrections: any[] = []
  const invalidRows: any[] = []
  const headers = data[0]
  const processedData = [headers]

  for (let i = 1; i < data.length; i++) {
    const row = [...data[i]]
    const originalRow = [...data[i]]

    // Validar campos obrigatórios
    const validation = validateRequiredFields(row, headers, subject)
    if (!validation.isValid) {
      invalidRows.push({
        row: i + 1,
        data: originalRow,
        missingFields: validation.missingFields,
      })
      continue
    }

    headers.forEach((header, colIndex) => {
      const originalValue = row[colIndex] || ""
      let newValue = originalValue.trim()

      // Aplicar correções básicas baseadas no tipo de campo
      if (header.includes("SITUACAO") || header === "Situação") {
        const situacao = originalValue.toUpperCase().trim()
        newValue = ["ATIVO", "SIM", "NORMAL", "A", "S"].includes(situacao) ? "ATIVO" : "INATIVO"
      } else if (header.includes("EMPRESA") || header.includes("FILIAL")) {
        newValue = onlyNumbers(originalValue)
      } else if (header.includes("VALOR") || header.includes("PERCENTUAL") || header.includes("PRECO")) {
        newValue = formatDecimal(originalValue, 2)
      } else if (header.includes("CODIGO") && !header.includes("PRODUTO")) {
        newValue = onlyNumbers(originalValue)
      }

      if (newValue !== originalValue) {
        corrections.push({
          row: i + 1,
          column: header,
          before: originalValue,
          after: newValue,
          reason: `Valor padronizado de "${originalValue}" para "${newValue}"`,
        })
      }

      row[colIndex] = newValue
    })

    processedData.push(row)
  }

  return { data: processedData, corrections, invalidRows }
}

function parseCSV(text: string): string[][] {
  const lines = text.split("\n")
  const result: string[][] = []

  lines.forEach((line) => {
    if (line.trim()) {
      // Detecta se usa vírgula ou ponto e vírgula como separador
      const separator = line.includes(";") ? ";" : ","
      const values = line.split(separator)
      result.push(values.map((value) => value.replace(/^"|"$/g, "").trim()))
    }
  })

  return result
}

async function processFile(file: File, subject: string) {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const data = parseCSV(text)

        if (data.length === 0) {
          resolve({
            success: false,
            error: "Arquivo CSV vazio ou inválido",
          })
          return
        }

        // Validar cabeçalhos
        const headerValidation = validateHeaders(data[0], subject)
        if (!headerValidation.isValid) {
          resolve({
            success: false,
            error: headerValidation.message,
          })
          return
        }

        let result: { data: string[][]; corrections: any[]; invalidRows: any[] }

        switch (subject) {
          case "PESSOAS":
            result = tratarPessoas(data)
            break
          case "PRODUTOS":
            result = tratarProdutos(data)
            break
          case "INFORMACOES_FISCAIS":
            result = tratarInformacoesFiscais(data)
            break
          case "PLANO_FINANCEIRO":
          case "PLANO_CONTABIL":
          case "CENTRO_CUSTO":
          case "CLIENTE":
          case "DEPOSITO":
          case "CONVERSAO_UNIDADE_MEDIDA":
          case "ENGENHARIAS":
          case "TITULOS_RECEBER":
          case "TITULOS_PAGAR":
          case "SITUACAO_NCM":
          case "REPRESENTANTE":
          case "SALDOS_CONTABEIS":
          case "TABELA_PRECO_VENDA":
          case "TABELA_PRECO_COMPRA":
          case "SALDO_INICIAL_ESTOQUE":
          case "SERVICO":
            result = tratarGenerico(data, subject)
            break
          default:
            resolve({
              success: false,
              error: `Processamento para ${subject} ainda não implementado`,
            })
            return
        }

        // Gerar CSV corrigido com separador ponto e vírgula
        const csvContent = result.data.map((row) => row.join(";")).join("\n")

        resolve({
          success: true,
          totalRows: data.length - 1,
          processedRows: result.data.length - 1,
          correctedRows: result.corrections.length,
          excludedRows: result.invalidRows.length,
          corrections: result.corrections,
          invalidRows: result.invalidRows,
          correctedData: csvContent,
        })
      } catch (error) {
        resolve({
          success: false,
          error: `Erro ao processar arquivo: ${error}`,
        })
      }
    }

    reader.readAsText(file, "utf-8")
  })
}

const SUBJECTS = {
  PESSOAS: { name: "Pessoas", icon: "👥" },
  PRODUTOS: { name: "Produtos", icon: "📦" },
  INFORMACOES_FISCAIS: { name: "Informações Fiscais (PEPS)", icon: "📊" },
  CLIENTE: { name: "Cliente (Especialização Comercial)", icon: "🏢" },
  CONVERSAO_UNIDADE_MEDIDA: { name: "Conversão Unidade de Medida", icon: "⚖️" },
  DEPOSITO: { name: "Depósito", icon: "🏪" },
  ENGENHARIAS: { name: "Engenharias", icon: "⚙️" },
  PLANO_FINANCEIRO: { name: "Plano Financeiro", icon: "💰" },
  PLANO_CONTABIL: { name: "Plano Contábil", icon: "📚" },
  CENTRO_CUSTO: { name: "Centro de Custo", icon: "🏢" },
  TITULOS_RECEBER: { name: "Títulos a Receber", icon: "💵" },
  TITULOS_PAGAR: { name: "Títulos a Pagar", icon: "💸" },
  SITUACAO_NCM: { name: "Situação NCM", icon: "📋" },
  REPRESENTANTE: { name: "Representante (Especialização Comercial)", icon: "👤" },
  SALDOS_CONTABEIS: { name: "Saldos Contábeis", icon: "💰" },
  TABELA_PRECO_VENDA: { name: "Tabela de Preço de Venda", icon: "💲" },
  TABELA_PRECO_COMPRA: { name: "Tabela de Preço de Compra", icon: "🛒" },
  SALDO_INICIAL_ESTOQUE: { name: "Saldo Inicial de Estoque", icon: "📦" },
  SERVICO: { name: "Serviços", icon: "🔧" },
}

export default function SpreadsheetValidator() {
  const [selectedSubject, setSelectedSubject] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<any>(null)
  const [dragActive, setDragActive] = useState(false)
  const [showCorrections, setShowCorrections] = useState(false)

  // Reset ao trocar de assunto
  const handleSubjectChange = (newSubject: string) => {
    setSelectedSubject(newSubject)
    setFile(null)
    setValidationResult(null)
    setShowCorrections(false)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type === "text/csv" || droppedFile.name.endsWith(".csv")) {
        setFile(droppedFile)
        setValidationResult(null)
        setShowCorrections(false)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setValidationResult(null)
      setShowCorrections(false)
    }
  }

  const handleValidate = async () => {
    if (!file || !selectedSubject) return

    setIsValidating(true)
    try {
      const result = (await processFile(file, selectedSubject)) as any
      setValidationResult(result)
    } catch (error) {
      console.error("Erro na validação:", error)
      setValidationResult({
        success: false,
        error: "Erro inesperado durante a validação",
      })
    } finally {
      setIsValidating(false)
    }
  }

  const downloadCorrectedFile = () => {
    if (!validationResult?.correctedData) return

    // Adicionar BOM UTF-8 para garantir acentos corretos
    const BOM = "\uFEFF"
    const blob = new Blob([BOM + validationResult.correctedData], {
      type: "text/csv;charset=utf-8;",
    })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${selectedSubject.toLowerCase()}_corrigido.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadTemplate = () => {
    if (!selectedSubject || !CSV_TEMPLATES[selectedSubject]) return

    const BOM = "\uFEFF"
    const blob = new Blob([BOM + CSV_TEMPLATES[selectedSubject]], {
      type: "text/csv;charset=utf-8;",
    })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `modelo_${selectedSubject.toLowerCase()}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-emerald-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/senior-sistemas-logo-yKimUkBMj4Q9dKIsoJMMTks6J6zL6S.png"
                alt="Senior Logo"
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Validador SeniorX</h1>
                <p className="text-sm text-gray-600">
                  Sistema de validação e correção automática para carga inicial ERP
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                window.open(
                  "https://documentacao.senior.com.br/seniorxplatform/manual-do-usuario/erp/#cadastros/ferramentas/importar-carga-inicial.htm",
                  "_blank",
                )
              }
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Documentação
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <Card className="border-emerald-200">
              <CardHeader className="bg-emerald-50">
                <CardTitle className="text-emerald-800 flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Selecionar Planilha e Processar
                </CardTitle>
                <CardDescription>
                  Selecione o assunto e faça upload do arquivo CSV para validação automática
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Subject Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Assunto da Planilha</label>
                  <Select value={selectedSubject} onValueChange={handleSubjectChange}>
                    <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                      <SelectValue placeholder="Selecione o assunto..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(SUBJECTS).map(([key, subject]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center space-x-2">
                            <span>{subject.icon}</span>
                            <span>{subject.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Template Download */}
                {selectedSubject && CSV_TEMPLATES[selectedSubject] && (
                  <div className="flex justify-center">
                    <Button
                      onClick={downloadTemplate}
                      variant="outline"
                      size="sm"
                      className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Baixar Modelo da Planilha
                    </Button>
                  </div>
                )}

                {/* File Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Arquivo CSV</label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive ? "border-emerald-500 bg-emerald-50" : "border-emerald-200 hover:border-emerald-300"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <FileText className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                    {file ? (
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Arraste e solte seu arquivo CSV aqui ou</p>
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 cursor-pointer"
                        >
                          Selecionar arquivo
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Validate Button */}
                <Button
                  onClick={handleValidate}
                  disabled={!file || !selectedSubject || isValidating}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  size="lg"
                >
                  {isValidating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Validar e Ajustar Planilha
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            <Card className="border-emerald-200">
              <CardHeader className="bg-emerald-50">
                <CardTitle className="text-emerald-800 text-lg">Correções Automáticas</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Validação de cabeçalhos por assunto</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Padronização SIM/NÃO e ATIVO/INATIVO</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Formatação CPF/CNPJ com zeros à esquerda</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Correção de unidades de medida</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Validação de valores numéricos e decimais</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Exclusão de registros com campos obrigatórios vazios</span>
                </div>
              </CardContent>
            </Card>

            {selectedSubject && (
              <Card className="border-emerald-200">
                <CardHeader className="bg-emerald-50">
                  <CardTitle className="text-emerald-800 text-lg flex items-center">
                    <span className="mr-2">{SUBJECTS[selectedSubject as keyof typeof SUBJECTS]?.icon}</span>
                    {SUBJECTS[selectedSubject as keyof typeof SUBJECTS]?.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600">
                    O sistema aplicará automaticamente todas as regras de validação e correção específicas para este
                    tipo de planilha, incluindo validação de cabeçalhos.
                  </p>
                  {CSV_TEMPLATES[selectedSubject] && (
                    <div className="mt-3">
                      <Badge variant="outline" className="text-emerald-700 border-emerald-200">
                        Modelo disponível para download
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Validation Results */}
        {validationResult && (
          <Card className="mt-8 border-emerald-200">
            <CardHeader className="bg-emerald-50">
              <CardTitle className="text-emerald-800 flex items-center">
                {validationResult.success ? (
                  <CheckCircle className="w-5 h-5 mr-2 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                )}
                Resultado do Processamento
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {validationResult.success ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{validationResult.totalRows}</div>
                      <div className="text-sm text-blue-600">Total de registros</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">{validationResult.processedRows}</div>
                      <div className="text-sm text-green-600">Registros processados</div>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-emerald-600">{validationResult.correctedRows}</div>
                      <div className="text-sm text-emerald-600">
                        <div className="flex items-center justify-center gap-2">
                          <span>Correções realizadas</span>
                          {validationResult.corrections && validationResult.corrections.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowCorrections(!showCorrections)}
                              className="h-6 px-2 text-xs"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              {showCorrections ? "Ocultar" : "Ver"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-red-600">{validationResult.excludedRows}</div>
                      <div className="text-sm text-red-600">Registros excluídos</div>
                    </div>
                  </div>

                  {validationResult.invalidRows && validationResult.invalidRows.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-red-700">
                        Registros Excluídos (Campos Obrigatórios Faltando)
                      </h3>
                      <ScrollArea className="h-32 border rounded-lg">
                        <div className="p-4 space-y-2">
                          {validationResult.invalidRows.map((invalidRow: any, index: number) => (
                            <Alert key={index} className="border-red-200 bg-red-50">
                              <AlertCircle className="h-4 w-4 text-red-600" />
                              <AlertDescription className="text-sm">
                                <div className="space-y-1">
                                  <div>
                                    <strong>Linha {invalidRow.row}</strong>
                                  </div>
                                  <div className="text-red-600 text-xs">
                                    Campos obrigatórios faltando: {invalidRow.missingFields.join(", ")}
                                  </div>
                                </div>
                              </AlertDescription>
                            </Alert>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}

                  {showCorrections && validationResult.corrections && validationResult.corrections.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Detalhes das Correções</h3>
                      <ScrollArea className="h-64 border rounded-lg">
                        <div className="p-4 space-y-2">
                          {validationResult.corrections.map((correction: any, index: number) => (
                            <Alert key={index} className="border-yellow-200 bg-yellow-50">
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                              <AlertDescription className="text-sm">
                                <div className="space-y-1">
                                  <div>
                                    <strong>
                                      Linha {correction.row}, Coluna {correction.column}
                                    </strong>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs">
                                    <Badge variant="destructive" className="text-xs">
                                      {correction.before}
                                    </Badge>
                                    <span>→</span>
                                    <Badge variant="default" className="text-xs bg-green-600">
                                      {correction.after}
                                    </Badge>
                                  </div>
                                  <div className="text-gray-600 text-xs">{correction.reason}</div>
                                </div>
                              </AlertDescription>
                            </Alert>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-center">
                    <Button onClick={downloadCorrectedFile} className="bg-emerald-600 hover:bg-emerald-700" size="lg">
                      <Download className="w-4 h-4 mr-2" />
                      Baixar Arquivo Corrigido (CSV UTF-8 com BOM)
                    </Button>
                  </div>
                </div>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-medium mb-2">Erro no processamento:</div>
                    <p>{validationResult.error}</p>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
