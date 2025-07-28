export const SUBJECTS: { [key: string]: any } = {
  PESSOAS: {
    name: "Pessoas",
    description: "Cadastro de pessoas físicas e jurídicas",
    columns: [
      { name: "CODIGO", required: true, type: "numeric", maxLength: 9 },
      { name: "NOME", required: true, type: "text", maxLength: 100 },
      { name: "FANTASIA", required: true, type: "text", maxLength: 50 },
      { name: "TIPO_PESSOA", required: true, type: "enum", values: ["FISICA", "JURIDICA"] },
      { name: "CNPJ_CPF", required: false, type: "document" },
    ],
  },
  CLIENTE: {
    name: "Cliente (Especialização Comercial)",
    description: "Especialização comercial de clientes",
    columns: [
      { name: "EMPRESA", required: true, type: "numeric" },
      { name: "FILIAL", required: true, type: "numeric" },
      { name: "CODIGO_CLIENTE", required: true, type: "numeric" },
      { name: "CONDICAO_PAGAMENTO", required: false, type: "text" },
    ],
  },
  PRODUTOS: {
    name: "Produtos",
    description: "Cadastro de produtos",
    columns: [
      { name: "Código", required: true, type: "text", maxLength: 23 },
      { name: "Descrição", required: true, type: "text", maxLength: 120 },
      { name: "GTIN unidade tributável", required: false, type: "text", maxLength: 14 },
      { name: "Situação", required: true, type: "enum", values: ["ATIVO", "INATIVO"] },
    ],
  },
  SERVICO: {
    name: "Serviços",
    description: "Cadastro de serviços",
    columns: [
      { name: "EMPRESA", required: true, type: "numeric", maxLength: 4 },
      { name: "FAMILIA", required: true, type: "numeric", maxLength: 6 },
      { name: "CODIGO", required: true, type: "text", maxLength: 14 },
      { name: "DESCRICAO", required: true, type: "text", maxLength: 70 },
    ],
  },
  SALDO_INICIAL_ESTOQUE: {
    name: "Saldo Inicial de Estoque",
    description: "Importação de saldos iniciais de estoque",
    columns: [
      { name: "CODIGO_EMPRESA", required: true, type: "numeric" },
      { name: "CODIGO_FILIAL", required: true, type: "numeric" },
      { name: "CODIGO_PRODUTO", required: true, type: "text", maxLength: 23 },
      { name: "CODIGO_DEPOSITO", required: true, type: "text" },
    ],
  },
  REPRESENTANTE: {
    name: "Representante (Especialização Comercial)",
    description: "Especialização comercial de representantes",
    columns: [
      { name: "CODIGO_REPRESENTANTE", required: true, type: "numeric" },
      { name: "CODIGO_EMPRESA", required: true, type: "numeric" },
      { name: "CODIGO_FILIAL", required: true, type: "numeric" },
    ],
  },
  SITUACAO_NCM: {
    name: "Situação NCM",
    description: "Situação dos códigos NCM",
    columns: [
      { name: "Código", required: true, type: "numeric", maxLength: 8 },
      { name: "Situação", required: true, type: "enum", values: ["ATIVO", "INATIVO"] },
    ],
  },
  TABELA_PRECO_VENDA: {
    name: "Tabela de Preço de Venda",
    description: "Tabela de preços para venda",
    columns: [
      { name: "TIPO_ITEM", required: true, type: "enum", values: ["VP", "VS"] },
      { name: "CODIGO", required: true, type: "text" },
      { name: "UNIDADE_MEDIDA", required: true, type: "text" },
      { name: "CONDICAO_PAGAMENTO", required: false, type: "text" },
    ],
  },
  TABELA_PRECO_COMPRA: {
    name: "Tabela de Preço de Compra",
    description: "Tabela de preços para compra",
    columns: [
      { name: "TIPO", required: true, type: "enum", values: ["VP", "VS"] },
      { name: "COD_ITEM", required: true, type: "text", maxLength: 23 },
      { name: "COD_ITEM_FORNECEDOR", required: false, type: "text", maxLength: 30 },
      { name: "UNIDADE_MEDIDA", required: true, type: "text", maxLength: 6 },
    ],
  },
  TITULOS_PAGAR: {
    name: "Títulos a Pagar",
    description: "Importação de títulos a pagar",
    columns: [
      { name: "EMPRESA", required: true, type: "numeric", maxLength: 4 },
      { name: "FILIAL", required: true, type: "numeric", maxLength: 4 },
      { name: "NUMERO_TITULO", required: true, type: "text", maxLength: 15 },
      { name: "TIPO_TITULO", required: true, type: "text", maxLength: 3 },
    ],
  },
  TITULOS_RECEBER: {
    name: "Títulos a Receber",
    description: "Importação de títulos a receber",
    columns: [
      { name: "EMPRESA", required: true, type: "numeric", maxLength: 4 },
      { name: "FILIAL", required: true, type: "numeric", maxLength: 4 },
      { name: "NUMERO_TITULO", required: true, type: "text", maxLength: 15 },
      { name: "TIPO_TITULO", required: true, type: "text", maxLength: 3 },
    ],
  },
  INFORMACOES_FISCAIS: {
    name: "Informações Fiscais (PEPS)",
    description: "Informações fiscais para controle PEPS",
    columns: [
      { name: "EMPRESA", required: true, type: "numeric" },
      { name: "FILIAL", required: true, type: "numeric" },
      { name: "PRODUTO", required: true, type: "text", maxLength: 23 },
      { name: "QUANTIDADE", required: true, type: "decimal" },
    ],
  },
  CONVERSAO_UNIDADE_MEDIDA: {
    name: "Conversão Unidade de Medida",
    description: "Conversões entre unidades de medida",
    columns: [
      { name: "Código da empresa", required: true, type: "numeric" },
      { name: "Código do produto", required: true, type: "text" },
      { name: "Código da pessoa", required: false, type: "text" },
      { name: "Código da unidade de medida de origem", required: true, type: "text" },
    ],
  },
  DEPOSITO: {
    name: "Depósito",
    description: "Cadastro de depósitos",
    columns: [
      { name: "EMPRESA", required: true, type: "numeric" },
      { name: "FILIAL", required: true, type: "numeric" },
      { name: "CODIGO", required: true, type: "text" },
      { name: "DESCRICAO", required: true, type: "text" },
    ],
  },
  ENGENHARIAS: {
    name: "Engenharias",
    description: "Estruturas de engenharia de produtos",
    columns: [
      { name: "CODIGO_EMPRESA", required: true, type: "numeric" },
      { name: "CODIGO_FILIAL", required: true, type: "numeric" },
      { name: "CODIGO_SKU_PRODUCAO", required: true, type: "text" },
      { name: "CODIGO_ROTEIRO", required: false, type: "text" },
    ],
  },
  PLANO_FINANCEIRO: {
    name: "Plano Financeiro",
    description: "Plano de contas financeiro",
    columns: [
      { name: "codigoconta", required: true, type: "numeric", maxLength: 9 },
      { name: "classificacao", required: true, type: "text" },
      { name: "descricao", required: true, type: "text", maxLength: 250 },
      { name: "abreviatura", required: true, type: "text", maxLength: 20 },
    ],
  },
  PLANO_CONTABIL: {
    name: "Plano Contábil",
    description: "Plano de contas contábil",
    columns: [
      { name: "codigoconta", required: true, type: "numeric", maxLength: 9 },
      { name: "classificacao", required: true, type: "text" },
      { name: "descricao", required: true, type: "text", maxLength: 250 },
      { name: "abreviatura", required: true, type: "text", maxLength: 20 },
    ],
  },
  CENTRO_CUSTO: {
    name: "Centro de Custo",
    description: "Centros de custo",
    columns: [
      { name: "codigodocentrodecusto", required: true, type: "numeric", maxLength: 9 },
      { name: "classificacao", required: true, type: "text" },
      { name: "descricao", required: true, type: "text", maxLength: 250 },
      { name: "abreviatura", required: true, type: "text", maxLength: 20 },
    ],
  },
}
