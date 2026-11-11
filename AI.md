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

### Sessão 3: cliente da API e hook useChamados (commit 4)

- **O que a IA sugeriu:** criar `services/api.js`, o único lugar que chama `fetch`. Ele lê `VITE_API_URL` do `.env` e lança erro quando a resposta não é `ok`. Criar `services/chamadosService.js` com o CRUD (`criarChamado`, `listarChamados`, `buscarChamado`, `atualizarChamado` com PUT do objeto completo e `excluirChamado`). Criar `hooks/useChamados.js` com `useState` (lista, carregando, erro) e `useEffect` (carrega ao abrir, sem chamar setState direto dentro do efeito, como o lint pediu), mais as funções `criar`, `atualizar`, `mudarStatus` e `excluir`. O `mudarStatus` preenche `resolvidoEm` ao resolver.
- **O que mudamos:** _(completar)_
- **Como validamos:** no console do navegador, com o app rodando, testamos o CRUD contra o MockAPI real: POST, GET da lista e de um item, PUT e DELETE. Depois montamos um componente temporário para testar o hook: começa carregando, termina carregado, cria, muda o status e exclui. Os registros de teste foram apagados e a API voltou a ficar vazia. `npm run build` e `npm run lint` sem erros.

### Sessão 4: leituras simuladas e trechos nos 3 estados (commit 5)

- **O que a IA sugeriu:** criar `utils/simulacao.js` com perfis inventados por trecho e chance de 5% de falha do sensor, `utils/formatadores.js` (valor com unidade e vírgula decimal) e o hook `useLeituras`, que gera uma passagem a cada 4 s com `setInterval` dentro do `useEffect` e limpa o timer ao sair. O estado de cada trecho é calculado a partir das leituras, sem ser guardado à parte. Componentes: `StatusPicto` (visto, losango, octógono e quadrado tracejado em SVG), `FitaEstado` (fita lisa, listrada ou diagonal), `EtiquetaEstado` (pictograma + texto) e `CartaoTrecho`. Os componentes `FitaEstado` e `EtiquetaEstado` não estavam no plano. Foram criados para reaproveitar nas próximas telas.
- **O que mudamos:** _(completar)_
- **Como validamos:** abrimos no navegador e vimos os 6 trechos com os 3 estados e "sem dados", cada um com cor, forma, padrão e texto. A passagem avança sozinha e os valores mudam. No celular (375 px) não aparece rolagem horizontal. `npm run build` e `npm run lint` sem erros.

### Sessão 5: tela do Cidadão (commit 6)

- **O que a IA sugeriu:** dividir o app em telas (`pages/Cidadao.jsx` e `pages/Agente.jsx`, este último ainda como aviso) com troca por abas no `App`. O `useLeituras` subiu para o `App` para a simulação não reiniciar ao trocar de aba. Componentes novos: `Cabecalho`, `Abas` (com `role="tab"` e `aria-selected`), `LetreiroLED` (fonte Doto e `aria-live`), `SeletorCamada` (botões com `aria-pressed`), `MapaEsquematico` (faixa vertical em SVG com padrões liso, listrado e diagonal, e resumo em texto para leitor de tela) e `Legenda`. Lógica nova fora dos componentes: `utils/mensagens.js` (frase do letreiro com verbo no começo, escolhendo o alerta mais urgente) e `estadoDoTrecho` em `classificar.js`.
- **O que mudamos:** _(completar)_
- **Como validamos:** no navegador, o letreiro mostra o alerta mais grave, o seletor muda o mapa e o letreiro (ex.: "Luz à noite" destaca a R. Oscar Freire escura) e as abas trocam de tela. No celular (375 px) nada passa da largura da tela e todos os botões têm 44 px ou mais. `npm run build` e `npm run lint` sem erros.
