// Script para analisar os novos arquivos CSV

async function fetchAndAnalyzeNewCSV(url: string, filename: string) {
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

async function analyzeNewFiles() {
  const files = [
    {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/titulo-receber-NWYqx37xoWiiPJCTmpTHhhB4HvMk95.csv",
      name: "titulo-receber",
    },
    {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/situacao_ncm-gFZzmDyGgFg4ggtyssbbSfomyl5mcd.csv",
      name: "situacao_ncm",
    },
    {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/representante_comercial-ykiCwMostjFHXajvwYXhnued0xVivt.csv",
      name: "representante_comercial",
    },
    {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/titulo-pagar-g7qNAhXaMEL3oXNOpcXWX5AHNvnruL.csv",
      name: "titulo-pagar",
    },
    {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/saldo_contabil-irQd2VZ3C2rZhYzIuesd7pYbL6qi20.csv",
      name: "saldo_contabil",
    },
    {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tabela-precos-compra-YYejHHTw7VnT4RZrL4hjdseHc80n4C.csv",
      name: "tabela-precos-compra",
    },
    {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/servico-GD81eVSxRV2PdZvoTiGGhvcDUscWPK.csv",
      name: "servico",
    },
    {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tabela-precos-tHNchv1txWWuEEVA04bkfONX7CSh5N.csv",
      name: "tabela-precos",
    },
    {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/saldo-inicial-06ym92jhjOfICNq90nhjjuO801h1sP.csv",
      name: "saldo-inicial",
    },
  ]

  const results = []
  for (const file of files) {
    const result = await fetchAndAnalyzeNewCSV(file.url, file.name)
    if (result) results.push(result)
  }

  console.log("\n=== RESUMO DOS NOVOS CABEÇALHOS ===")
  results.forEach((result) => {
    console.log(`${result.filename}: [${result.headers.map((h) => `"${h}"`).join(", ")}]`)
  })

  return results
}

// Executar análise
analyzeNewFiles()
