# Uso de IA no projeto

> **Rascunho.** Este arquivo cobre o projeto inteiro e é atualizado a cada sessão de trabalho até a entrega final.

Ferramenta usada: **Claude Code** (Anthropic), guiado pelo arquivo [CLAUDE.md](CLAUDE.md).

Regras que seguimos:

- A IA não faz commit sozinha. Cada mudança é revisada e aprovada por um integrante.
- Todo código precisa ser entendido por quem vai apresentar.
- Toda mudança é validada rodando o app, o build e o lint.

## Registro por sessão

### Sessão 1: setup do projeto (commits 1 e 2)

- **O que a IA sugeriu:** criar a base com o template React do Vite e o Tailwind v4 via plugin do Vite. Colocar as cores e fontes do guia de estilo no `@theme` do CSS, respeitar `prefers-reduced-motion` e montar as pastas do projeto, o `.env.example`, este AI.md e o README.
- **O que mudamos:** separamos o setup em dois commits para seguir o `PLANO-DE-COMMITS.md`. _(complete com o que mais mudou)_
- **Como validamos:** `npm run build` e `npm run lint` sem erros. Abrimos o app com `npm run dev` e vimos o visual do guia, com o console sem erros.

### Sessão 2: regras de classificação e trechos da linha (commit 3)

- **O que a IA sugeriu:** criar `utils/classificar.js` com os limites do PDF numa tabela só (`CAMADAS`), a função `classificar(camada, valor)`, que devolve `normal`, `atencao`, `critico` ou `sem_dados`, a função `leituraValida`, que trata vazio, `NaN` e valor fora da faixa do sensor como "sem dados", e `estadoMaisGrave`. Criar também `data/linha.js` com os 6 trechos e a função `buscarTrecho`. As faixas mínima e máxima de cada sensor são simuladas e estão marcadas assim no código.
- **O que mudamos:** _(completar)_
- **Como validamos:** um script de teste com 27 casos, incluindo os valores exatos nas bordas (30 °C, 5 lux, 1,5 g, 25 µg/m³) e leituras inválidas, sem nenhuma falha. `npm run build` e `npm run lint` sem erros.
