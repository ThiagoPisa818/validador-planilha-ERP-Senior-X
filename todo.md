# TODO - Atualização do Validador Excel

## Fase 2: Implementação dos novos validadores

### Validações para PRODUTOS
- [x] Não remover "Código da família" quando preenchido
- [x] Corrigir lógica de "Código da unidade de medida de venda" (usar códigos ao invés de descrições)
  - UNIDADE -> UNID
  - METRO -> M
  - Aplicar mesma lógica para outras unidades

### Validações para PESSOAS  
- [x] Corrigir TIPO_ATIVIDADE: Comércio = COMERCIO

### Validações para PLANO_FINANCEIRO
- [x] Corrigir formatação de contas (ex: 1.1.0403 -> 1.1.04.03)
- [x] Remover ".00" de contas sintéticas iniciais (ex: 1.1.05.00 -> 1.1.05)
- [x] Corrigir níveis das contas automaticamente
- [x] Determinar ANALITICA/SINTETICA baseado na estrutura

### Validações para TÍTULOS (Pagar e Receber)
- [x] Remover duplicatas por NUMERO_TITULO
- [x] Validar FORNECEDOR ou CNPJ_CPF (não ambos)
- [x] Corrigir DATA_ENTRADA se menor que DATA_EMISSAO
- [x] Preencher MOEDA com "BRL" se vazio
- [x] Formatar PORTADOR com 3 dígitos (034, 999 padrão)
- [x] Formatar CARTEIRA com 2 dígitos (02, 99 padrão)
- [x] Preencher TRANSACAO padrão (90500 pagar, 90300 receber)
- [x] Preencher TIPO_TITULO padrão (NFC pagar, NFS receber)

### Validações Gerais
- [x] Implementar remoção de duplicatas por código único
- [x] Aplicar mesma lógica de plano financeiro para centro de custo e plano contábil

### Configuração GitHub Pages
- [x] Verificar se existe index.html na raiz
- [x] Configurar build para produção
- [x] Testar aplicação localmente

