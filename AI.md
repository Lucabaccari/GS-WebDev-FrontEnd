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

### Sessão 9: seed, deploy e documentação final (commit 10)

- **O que a IA sugeriu:** criar `scripts/seed.js` (comando `npm run seed`). Ele lê a `VITE_API_URL` do `.env` e cria 6 chamados de exemplo simulados, com status, tipos e origens variados e datas no passado, para os indicadores terem dados. A opção `--limpar` apaga tudo antes de criar e avisa que a API é compartilhada. No README entraram as seções Funcionalidades, Requisitos do desafio (onde cada um está no código), os comandos de seed, o passo a passo do deploy na Vercel (com a variável `VITE_API_URL`) e Limitações (API sem login e compartilhada, simulação por navegador, limites do plano gratuito, o que um sistema real teria). O CLAUDE.md foi atualizado com os 4 hooks e os arquivos novos.
- **Erro da IA no caminho:** um comando de terminal com crases de Markdown entre aspas duplas fez o shell tentar executar trechos do texto. Nenhum comando chegou a rodar, porque todos falharam com "script não encontrado". A IA conferiu o Git, os arquivos e a API antes de continuar e refez a edição com a ferramenta de edição de arquivos.
- **O que mudamos:** _(completar)_
- **Como validamos:** rodamos `npm run seed -- --limpar`, que apagou 10 chamados de teste e criou os 6 exemplos, conferidos na API. `node --check` no script de seed, `npm run build` e `npm run lint` sem erros. O app foi aberto no navegador do aluno com `npm run dev -- --open`.

### Sessão 10: mapa real, criticidade por ponto e redesenho

- **O que o aluno pediu:** achou o projeto básico. Pediu um mapa de verdade (Leaflet) com as 6 ruas, que o problema fosse mostrado **no ponto da rua** em vez de marcar a rua inteira como crítica, e um design melhor, mantendo as cores.
- **O que a IA sugeriu e fez:**
  - **Dados:** `data/ruas.js` (substitui `linha.js`) com o traçado das 6 ruas tirado do OpenStreetMap pela API Overpass e simplificado para uma linha central por rua. Cada rua tem 5 pontos de medição com rótulo simulado ("altura do nº 900"), e cada ponto "cuida" de um pedaço da rua.
  - **Lógica por ponto:** a simulação passou a gerar leituras por ponto. Quase todos os pontos ficam normais e só 6 têm problema (inventados). A regra da 6ª passagem conta por ponto e não duplica no mesmo ponto. O chamado ganhou `pontoId`, `pontoNome`, `lat` e `lng`. A rua mostra um resumo ("5 pontos · 1 crítico · 1 atenção") com `resumirRua`.
  - **Mapa (Leaflet + react-leaflet):** `MapaBase` (fundo do OpenStreetMap em tons de cinza, as 6 ruas em asfalto, zoom à direita), `CamadaPontos` (só o pedaço do ponto muda de cor: fita listrada na atenção, vermelha no crítico, mais o pictograma), `OnibusMarcador` (ônibus que anda pela rua a cada passagem, parado para quem pede menos movimento), `CamadaChamados` (chamados no ponto exato, desenho pelo status), `FocoNoMapa` ("Ver no mapa") e `AjusteDoMapa` (reenquadra o mapa quando a caixa muda de tamanho).
  - **Redesenho:** cabeçalho mais leve com marca, letreiro em faixa fina, mapa no centro da tela do Cidadão com o painel da rua ao lado (`SeletorRua` e `PainelRua`, com os pontos em faixa vertical, como estações), "Solicitar parada" sobre o mapa, "Avisar problema aqui" já preenchendo o ponto no formulário, legenda compacta e o modo demonstração numa caixa recolhível no fim da página. Na tela do Agente: mapa de chamados mais a fila de atendimento ordenada por status, prioridade e tempo de espera (`ordenarFila`).
  - Foram removidos `CartaoTrecho`, `MapaEsquematico`, `FitaEstado` e `linha.js`, que foram substituídos.
- **Problemas encontrados e corrigidos no caminho:**
  - O fundo da CARTO passou a pedir chave, e foi trocado pelo do OpenStreetMap.
  - O letreiro mostrava "UNDEFINED" porque os pontos estavam sem o nome da rua.
  - O `react-leaflet` não atualiza o `title` do marcador, e o leitor de tela leria o estado antigo. A correção foi recriar o marcador quando o estado muda.
  - O mapa ficava afastado demais. O zoom fracionado (`zoomSnap` de 0,25) resolveu.
  - Dois pontos com problema ficavam no mesmo cruzamento. O problema simulado da Rebouças mudou de ponto.
  - O `react-dom/server` aumentava o app em 200 KB e foi trocado por SVG em texto.
  - A IA errou de novo com crases dentro de um comando de terminal. Nada foi executado, e a correção foi feita com a ferramenta de edição.
- **O que mudamos:** o aluno definiu 6 ruas com pontos dentro delas e o formato dos nomes dos pontos. _(completar)_
- **Como validamos:**
  - Um script com 10 testes sem nenhuma falha: chamado só no ponto certo e na 6ª passagem, vizinho não conta, não duplica, resumo da rua, ordem da fila, caminho do ônibus.
  - No navegador: o clique no marcador abre o ponto no painel, "Avisar problema aqui" abre o formulário com o ponto, a camada "Luz" mostra só os pontos de luz e um aviso de teste apareceu no mapa do Agente no ponto certo (depois foi apagado da API).
  - No celular (375 px), nada vaza e todos os botões têm 44 px ou mais.
  - O console ficou sem erros depois de reiniciar o servidor.
  - `npm run build` e `npm run lint` sem erros.

### Sessão 11: um ônibus com sensor, câmera que acompanha e visões do mapa

- **O que o aluno pediu:** ainda achou simples. Pediu que só um ônibus da rota leve o sensor, que ele percorra cada rua em 1 minuto fazendo paradas, que ao escolher uma rua as outras sumam e o mapa aproxime e acompanhe o ônibus, que exista uma opção para ver todas as ruas com o mapa mais amplo e um ícone de ônibus mais bonito.
- **O que a IA sugeriu e fez:**
  - **Rota** (`utils/rota.js`, funções puras): o ônibus passa pelas 6 ruas em sequência. A ordem e o sentido são escolhidos para ele "pular" menos entre o fim de uma rua e o começo da próxima. Cada rua tem 60 s divididos em "etapas": andando (tempo proporcional à distância) e parado 4 s em cada um dos 5 pontos. `estadoNoTempo` diz onde o ônibus está em qualquer momento, `inicioDaProximaParada` serve ao botão de pular e `tempoAteRua` dá a previsão de chegada.
  - **Hooks:** `useOnibus` (novo) guarda o tempo da simulação, anda 5 vezes por segundo e avisa quando o ônibus chega numa parada. `useLeituras` passou a registrar a leitura **só do ponto onde o ônibus parou** (`registrarLeitura`), contando as leituras de cada ponto. A regra da 6ª passagem agora conta por parada (`atualizarSequenciaPonto`).
  - **Mapa:**
    - `CameraDoMapa` enquadra a rua ou todas as ruas e acompanha o ônibus. Se a pessoa arrasta o mapa, ele para de seguir e aparece o botão "Acompanhar ônibus".
    - `CamadaRastro` desenha em âmbar tracejado o trecho que o ônibus já percorreu.
    - O ícone novo mostra o ônibus visto de cima, girando conforme a direção, com a caixa de sensores âmbar no teto, que pisca enquanto lê. O balão escuro diz "Lendo nº 900" ou "Próx.: nº 1300".
    - O ponto que está sendo lido ganha moldura âmbar.
  - **Telas:**
    - `SeletorVisao` tem "Seguir ônibus", "Todas as ruas" e as 6 ruas, cada uma com "ônibus em m:ss".
    - `PainelViagem` mostra a rua atual, a parada, a barra do trajeto com as 5 paradas e quando o ônibus chega na próxima rua.
    - `PainelRua` mostra os pontos na ordem do ônibus, com "Lendo agora", "Próxima parada" e "Leitura nº N".
    - `PainelTodas` traz o resumo das 6 ruas embaixo do mapa amplo.
    - Quando a rua escolhida não tem o ônibus, aparece o aviso "Chega aqui em m:ss" com o botão "Seguir o ônibus agora".
  - **Modo demonstração:** velocidades 1x, 2x, 5x e 10x, e "Pular para a próxima parada".
  - **Desempenho:** como a tela redesenha 5 vezes por segundo, os ícones do mapa ficam guardados em cache para não serem recriados a cada vez.
- **Problemas encontrados e corrigidos:**
  - Erro de arredondamento no "pular para a próxima parada": o tempo calculado caía uma fração antes da parada. A correção soma 1 ms.
  - O lint avisou sobre dependências da câmera. A correção foi ler a posição e os limites por `useRef`, para só reenquadrar quando a visão muda.
- **O que mudamos:** _(completar)_
- **Como validamos:**
  - 16 testes da rota sem nenhuma falha: cada rua soma 60 s, 5 paradas em ordem, uma volta passa pelas 30 paradas (também a 10x), "pular" vai para a parada certa (inclusive trocando de rua e de volta) e a previsão de chegada está certa.
  - Os testes da sessão anterior continuam passando, e a sequência por parada conta 1, 2, ..., 7 e volta a 0 com uma leitura normal.
  - No navegador: "Seguir ônibus" mostra só a rua do ônibus com o ônibus no centro, e troca de rua sozinho quando ele termina uma. "Todas as ruas" mostra as 6. Uma rua sem o ônibus mostra a previsão de chegada. Na parada, a contagem de leituras do ponto subiu de 1 para 2 e a caixa do sensor piscou.
  - No celular (375 px), nada vaza nas três visões e na tela do Agente.
  - Console sem erros. `npm run build` e `npm run lint` sem erros.

### Sessão 12: um ônibus por rua, medição a cada 100 m e local exato

- **O que o aluno pediu:** ver cada ônibus na sua rua ao mesmo tempo, também no mapa geral. Passagem de 3 minutos. Medir a cada 100 m e apontar o número exato da ocorrência com margem de 20 números ("Av. Paulista, de 1006 a 1030"). Para luz e pavimento, destacar só aquele ponto, e não o trecho todo.
- **O que a IA sugeriu e fez:**
  - **Dados:** `data/ruas.js` regerado a partir do mesmo traçado, com um ponto a cada 100 m (159 pontos). Cada ponto ganhou `inicioM`, `fimM`, `numeroDe` e `numeroAte`. A numeração é simulada: 1 número por metro. Foi criada a função `pontoNoMetro`.
  - **Rota** (`utils/rota.js`, reescrita): 6 trajetos, um por rua. Cada ônibus faz a passagem em 3 min, sempre no sentido da numeração, com paradas de ônibus simuladas a cada 450 m, e sai 30 s depois do anterior. `estadoDoOnibus` diz onde está cada ônibus, e `pontosPassados` diz quais pontos ele passou entre dois momentos. O sensor lê nesses pontos, andando ou parado.
  - **Simulação:** os problemas ganharam um lugar exato em metros (`PROBLEMAS`). `localDaOcorrencia` devolve 20 números em volta do lugar para luz e pavimento, e o trecho de 100 m para calor e ar.
  - **Hooks:** `useOnibus` move os 6 ônibus e avisa os pontos passados. `useLeituras.registrarLeituras` atualiza vários pontos de uma vez e calcula, uma vez só, o local de cada camada de cada ponto (`LOCAIS`).
  - **Mapa e telas:**
    - `CamadaPontos` destaca só o local exato, e no mapa amplo mostra apenas os lugares com problema. `CamadaParadas` mostra as placas de parada. Os ônibus ficam menores no mapa amplo.
    - `PainelRua` traz as ocorrências com a numeração ("lugar exato" ou "trecho de 100 m") e todos os pontos numa caixa que abre e fecha.
    - `PainelViagem` mostra a numeração onde o ônibus está.
    - `PainelTodas` mostra os 6 ônibus com uma barrinha do trajeto.
    - Letreiro, chamados automáticos, chamados do cidadão e seed passaram a usar o local exato.
  - **Modo demonstração:** "Adiantar 15 s" no lugar de "pular para a próxima parada".
- **Problemas encontrados e corrigidos:**
  - A numeração repetia o número na divisa de dois trechos ("900 a 1000" e "1000 a 1100"). Agora cada trecho começa no número seguinte.
  - Os 6 ônibus ficavam grandes demais no mapa amplo e ganharam uma versão menor.
- **O que mudamos:** _(completar)_
- **Como validamos:**
  - Testes de lógica sem nenhuma falha: 6 ônibus, passagem de exatamente 3 min, numa passagem cada um dos 159 pontos é lido uma vez (também a 10x), os ônibus em posições diferentes, todos os problemas dentro de algum ponto, luz na Oscar Freire em "nº 1036 a 1056", calor usando o trecho inteiro, ponto do problema quase sempre crítico e ponto vizinho normal.
  - Os testes antigos da regra continuam passando.
  - No navegador: os 6 ônibus andam juntos no mapa amplo. Na rua escolhida, o ônibus fica no centro, com as placas de parada e a ocorrência "nº 1036 a 1056 · lugar exato". A 10x, um ponto passou da leitura nº 1 para a nº 2.
  - No celular, nada vaza. Numa aba nova, depois de passar por todas as visões e pelo Agente, o console ficou sem erros.
  - `npm run build` e `npm run lint` sem erros.

### Sessão 13: ida e volta, numeração por contexto, "Avisar problema" e formulário novo

- **O que o aluno pediu:**
  - Mostrar o número metro a metro só na rua escolhida, e o trecho de 100 m nos outros lugares.
  - Ônibus em ida e volta, em vez de recomeçar do início.
  - Trocar "Solicitar parada" por algo como "avisar problema".
  - Um formulário melhor: campo de rua, campo de trecho que depende da rua e tipo com a opção "Outros".
- **O que a IA sugeriu e fez:**
  - **Ida e volta** (`utils/rota.js`): as passagens ímpares são ida (do nº 1 ao fim) e as pares são volta (do fim ao nº 1). As paradas ficam no mesmo lugar físico nos dois sentidos (`etapasIda` e `etapasVolta`). Na volta, o ícone gira 180°. O rastro e a barra do trajeto passam a crescer a partir da ponta em que o ônibus começou. `pontosPassados` trata a virada na ponta da rua. O estado do ônibus ganhou `indo`, `rastro` e `trecho`.
  - **Numeração por contexto:** os botões das ruas e os cartões de "Todas as ruas" mostram o trecho ("nº 401 a 500") e se o ônibus está indo ou voltando. O número exato fica no painel da viagem, no balão do ônibus e no letreiro da rua em foco.
  - **Botão "Avisar problema"** (`BotaoAvisar`, antes `BotaoParada`), com pictograma de alfinete com "!". A resposta no letreiro passou a ser "Aviso recebido. A subprefeitura vai analisar.".
  - **Formulário:**
    - Campos: 1) rua; 2) trecho, bloqueado até escolher a rua, com a lista dos trechos de 100 m daquela rua e o aviso "— Luz à noite: crítico" quando o sensor já achou algo ali; 3) tipo, em botões de escolha (radio), com "Outros".
    - Quando o sensor já registrou o mesmo problema no trecho, aparece a dica "Seu aviso ajuda a confirmar".
    - Em "Outros", a descrição pede pelo menos 10 letras e a prioridade começa baixa.
    - `TIPOS_DE_PROBLEMA` também passou a valer nos filtros e nos indicadores do Agente.
- **Problemas encontrados e corrigidos:** alguns ônibus mostravam "passagem 0" por causa do atraso de saída, e a contagem passou a começar em 1. O teste antigo "3 min leem todos os pontos" deixou de valer com a ida e volta e foi trocado por dois: "uma passagem lê cada ponto uma vez" e "ida + volta lê cada ponto 2 vezes".
- **O que mudamos:** _(completar)_
- **Como validamos:**
  - Testes de lógica sem nenhuma falha: ida e volta de 3 min cada, virada sem pulo, sentido alternando, paradas iguais nos dois sentidos, cada passagem lê todos os pontos uma vez, ida + volta lê cada ponto 2 vezes, passagens começando em 1.
  - No navegador:
    - Os resumos mostram o trecho e o sentido.
    - Na volta da R. da Consolação, a numeração caiu de 249 para 202.
    - No formulário, o campo de trecho fica bloqueado até escolher a rua, a dica do sensor aparece e "Outros" exige 10 letras.
    - O aviso "Outros" apareceu no Agente com prioridade baixa e foi apagado da API depois.
  - No celular, o formulário cabe e todos os campos têm 44 px ou mais.
  - Numa aba nova, o console ficou sem erros. `npm run build` e `npm run lint` sem erros.
- **Ajuste pedido depois:** o aluno quis que o tipo do problema tivesse o mesmo formato dos outros campos. Os botões de escolha (radio) viraram uma lista de seleção igual às de rua e trecho, com o mesmo estilo e 44 px de altura. Conferimos no navegador: os 3 campos iguais, a dica do sensor funcionando e o console sem erros.
