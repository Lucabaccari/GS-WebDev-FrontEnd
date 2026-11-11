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

### Sessão 6: CRUD de chamados na interface (commit 7)

- **O que a IA sugeriu:** criar `utils/chamados.js` com os rótulos, a prioridade calculada pelo estado atual do trecho (crítico = alta, atenção = média), a validação do formulário e o filtro da lista. Em `formatadores.js`, criar o protocolo `PL-000001` e a data em formato brasileiro. Componentes novos: `BotaoParada`, `FormChamado` (campos controlados e erro com `role="alert"`), `BilheteChamado` (protocolo, picote, carimbo de status, etiqueta "Dados simulados", botões de status e exclusão com confirmação dentro do próprio bilhete), `ListaChamados` (carregando, erro com "Tentar de novo" e lista vazia) e `FiltrosChamados`. O `useChamados` subiu para o `App`, para as duas telas verem a mesma lista. O letreiro mostra "Parada solicitada" por 5 s (um `useEffect` com `setTimeout`). O lint pediu para tirar a constante `FILTROS_VAZIOS` do arquivo do componente, e ela foi para `utils/chamados.js`.
- **O que mudamos:** _(completar)_
- **Como validamos:** testamos pela interface, contra o MockAPI real: o formulário vazio mostra o erro, o envio cria o chamado e o letreiro mostra "Parada solicitada". Na aba Agente, o bilhete aparece com prioridade "Alta", o status muda para "Em atendimento", o filtro por "Resolvido" mostra 0 de 1 e o "Limpar" volta a mostrar tudo. A exclusão pede confirmação e apaga, e a API voltou a ficar vazia. `npm run build` e `npm run lint` sem erros.

### Sessão 7: painel do Agente e chamado automático (commit 8)

- **O que a IA sugeriu:** criar `utils/regras.js` com `PASSAGENS_PARA_CHAMADO`, `atualizarSequencias` (soma 1 a cada passagem crítica e zera com qualquer outro resultado, inclusive "sem dados"), `chamadosParaAbrir` (abre só quando a contagem chega exatamente ao limite e não duplica se já houver um automático sem resolver para o mesmo trecho e tipo) e `montarChamadoAutomatico`. O `useLeituras` passou a guardar passagem, leituras e sequências num estado só. Criar o hook `useChamadoAutomatico` no `App`, com `useRef` para não conferir a mesma passagem duas vezes. Criar `utils/indicadores.js` (contagens por status, tipo e origem, e tempo médio de resolução), `formatarDuracao` e o componente `Indicadores`, com placas sem setinhas e barras simples por tipo. O cartão do trecho mostra "Crítico há N de 6 passagens".
- **O que mudamos:** o grupo trocou a regra da 3ª passagem (do PDF) para a **6ª passagem**. CLAUDE.md, README e PLANO-DE-COMMITS foram atualizados. A IA também reduziu a variação da luz na simulação (de ±8 para ±3 lux) e deixou a R. Oscar Freire como "rua escura" (1 lux), para a regra aparecer de forma previsível na demo. _(completar se houver mais)_
- **Como validamos:** um script com 9 testes da regra e dos indicadores, sem nenhuma falha: abre só na 6ª, zera a contagem, não duplica, calcula o tempo médio. Com o app rodando contra o MockAPI real, os chamados automáticos nasceram sozinhos na 6ª passagem crítica. Depois que um deles foi resolvido, uma nova sequência abriu outro, como a regra prevê. Os indicadores e o tempo médio foram conferidos na tela. Os chamados de teste foram apagados. `npm run build` e `npm run lint` sem erros.

### Sessão 8: modo demonstração, sem conexão e acessibilidade (commit 9)

- **O que a IA sugeriu:**
  - **Demo:** o `useLeituras` passou a aceitar `pausado` e `intervaloMs` e a devolver `avancar()`. O componente `ControlesDemo` tem Pausar/Continuar, "Avançar passagem" e as velocidades Lenta (8 s), Normal (4 s) e Rápida (1,5 s), com o aviso "Simulação acelerada... Na rua, são vários minutos".
  - **Sem conexão:** o hook `useOnlineStatus` ouve os eventos `online`/`offline` do navegador. O `BannerOffline` mostra o aviso. Sem internet, a simulação para e a tela mantém as últimas leituras. `services/cache.js` salva os chamados no `localStorage` (com `try/catch`). Se a API falhar, o `useChamados` mostra a cópia salva com o aviso. Quando a internet volta, os chamados são buscados de novo.
  - **Chave do chamado automático:** botão "Chamado automático: ligado/desligado" no modo demonstração, que começa **desligado**. Como a API é compartilhada e não tem login, qualquer pessoa que abrisse o site criaria chamados automáticos. Agora isso só acontece quando alguém liga a chave (por exemplo, na apresentação).
  - **Acessibilidade:** foco visível com `:focus-visible` (contorno asfalto e anel amarelo), setas ← → nas abas (só a aba ativa entra no Tab) e o link "Pular para o conteúdo".
- **O que mudamos:** o aluno pediu a chave para ligar e desligar o chamado automático, depois de discutir que o MockAPI é um banco único, sem usuários. _(completar se houver mais)_
- **Como validamos:**
  - Com a chave desligada, a R. Oscar Freire chegou a 9 passagens críticas e nenhum POST saiu do app. O hook foi testado isolado: desligado não cria, ligado cria 1 chamado e a mesma passagem não cria de novo.
  - Pausar congela a passagem, "Avançar" soma 1 e a velocidade Rápida faz 2 passagens em 3,2 s.
  - Simulando a perda de conexão, o aviso aparece, a simulação para e os controles ficam bloqueados. Quando a conexão volta, tudo retoma.
  - Com a API derrubada de propósito, os chamados salvos continuam na tela, e "Tentar de novo" volta ao normal.
  - O contraste de todas as cores usadas foi calculado pela fórmula WCAG e todas passam de 4,5:1 (a menor é 5,02:1).
  - Com a tecla Tab de verdade, aparece "Pular para o conteúdo" e o foco fica visível.
  - No celular (375 px), nada vaza da tela e todos os botões e campos têm 44 px ou mais.
  - `npm run build` e `npm run lint` sem erros.
