# Uso de IA no projeto

Este arquivo registra, de forma transparente, como usamos Inteligência Artificial no desenvolvimento do **Pulso Web** (Global Solution 2026.2, CitizenTech).

## 1. Ferramentas utilizadas

| Ferramenta | Para que usamos |
|---|---|
| **Claude Code** (Anthropic), no app de desktop e no VS Code | Par de programação: planejar os commits, escrever e revisar código React, explicar trechos em português simples, rodar build e lint, testar o app num navegador embutido (computador e celular) e manter a documentação. Seguia as regras do nosso arquivo [CLAUDE.md](CLAUDE.md). |
| **Claude Code: pesquisa na web** | Encontrar dados públicos sobre São Paulo (frota de ônibus, passageiros, iluminação, ondas de calor, ilha de calor em Paraisópolis). Cada número foi conferido por nós na página de origem antes de entrar no site. |

Outras ferramentas que **não são IA**, mas apareceram no processo: `ffmpeg` (tirar quadros do vídeo do grupo e borrar placas na foto), MockAPI (API dos chamados) e OpenStreetMap (traçado das ruas e fundo do mapa).

Combinados que valeram o projeto todo:

- A IA **não fazia commit sozinha**: ela mostrava a mudança, propunha a mensagem e esperava a nossa aprovação.
- Todo código precisava ser entendido por quem ia apresentar. Por isso pedimos código simples, comentado em português.
- Nada de dados reais inventados: o que é simulado aparece como simulado na tela.

## 2. Interações realizadas (principais pedidos)

| O que pedimos (resumo do prompt) | O que a IA respondeu ou fez | O que fizemos com isso |
|---|---|---|
| "Quero começar o projeto, aqui está todo o contexto" (com o CLAUDE.md e o plano de commits) | Montou a base com Vite + React + Tailwind v4, as pastas (`components`, `hooks`, `services`, `utils`, `data`) e propôs os commits na ordem do plano. | Revisamos e aprovamos commit por commit. |
| "Como funciona o MockAPI quando outra pessoa usar o site, sem login?" | Explicou que a API é um banco único e aberto: todos veem e mudam os mesmos chamados. Sugeriu uma chave para o chamado automático começar desligado. | Aceitamos a chave e registramos a limitação no README. |
| "Está muito básico. Quero um mapa de verdade, e o problema no ponto da rua, não na rua inteira." | Trouxe o Leaflet com o traçado real das 6 ruas, pontos de medição a cada 100 m e o local exato da ocorrência ("nº 1036 a 1056"). | Definimos as 6 ruas, o formato dos nomes dos pontos e pedimos vários ajustes até ficar claro. |
| "Esse chamado automático, quero que aconteça na 6ª passagem." Depois: "no terceiro alerta consecutivo". | Mudou a regra numa constante só (`PASSAGENS_PARA_CHAMADO`) e escreveu testes que conferem o 1º, o 2º e o 3º alerta. | Voltamos para a 3ª passagem para seguir o vídeo e o PDF do grupo. |
| "Quero um index explicando o problema e a solução, alinhado ao vídeo, com dados reais." | Criou a página Início, com o termômetro animado de Paraisópolis × Morumbi, o simulador em 4 etapas e o diagrama "Por dentro". | Cortamos excesso de informação, mudamos textos, pedimos a foto do ônibus e um passo para cada jeito de abrir o chamado. |
| "Ajuste para ser responsivo; faça uma revisão geral." | Mediu cada tela em 375, 768 e 1024 px. Criou o menu do celular e diminuiu os ícones do mapa. | Apontamos o que estava ruim no nosso celular (termômetro cortado, camadas rolando de lado) e conferimos de novo. |
| "Avisar o usuário sobre o melhor caminho: ele escolhe ruas e intervalos, e o app vê se há alerta." | Criou o "Verifique seu caminho" (plano B), com a conta em `utils/caminho.js`, separada da tela. | Deixamos claro na tela que, na vida real, o caminho viria da origem e do destino. |

## 3. Aplicação no projeto

**O que a IA ajudou a desenvolver:**

- **Base e dados:** serviços da API (`services/api.js`, `chamadosService.js`, `cache.js`), o único lugar que chama `fetch`; o CRUD completo de chamados (criar, listar, mudar status, excluir); o seed com chamados de exemplo.
- **Lógica de negócio (funções puras em `utils/`):** classificação dos estados pelos limites do PDF, regra do chamado automático no 3º alerta seguido, simulação das leituras, ônibus em ida e volta, prioridade e ordem da fila, indicadores e a verificação do caminho.
- **8 custom hooks:** `useChamados`, `useLeituras`, `useOnibus`, `useChamadoAutomatico`, `useOnlineStatus`, `useNaTela`, `useContagem` e `useTour`.
- **40 componentes**, entre eles o mapa (`MapaBase`, camadas de pontos, ônibus e chamados), o bilhete do chamado, o formulário "Avisar problema", o simulador do Início, os tours guiados e o painel de demonstração.
- **Telas:** Início (problema, solução, por dentro, demonstrações), Cidadão (mapa ao vivo, resumo das ruas, aviso, caminho) e Agente (indicadores e fila, com cores próprias).
- **Qualidade:** acessibilidade (estado sempre com cor + forma + texto, botões de 44 px, teclado, `prefers-reduced-motion`), uso sem internet e versão para celular.

**Decisões que foram do grupo:**

- O tema e o discurso vieram do nosso vídeo: o ônibus que já roda a cidade vira sensor.
- Escolhemos as 6 ruas da região da Paulista e pedimos que o problema aparecesse **no ponto exato**, não na rua inteira, porque é isso que ajuda o cidadão e a subprefeitura de verdade.
- Trocamos "Solicitar parada" por **"Avisar problema"**, por fazer mais sentido para quem usa.
- Mudamos a regra para a 6ª passagem e depois voltamos para a **3ª**, para ficar igual ao que o vídeo e o PDF prometem.
- Pedimos várias vezes menos informação na tela: tiramos fontes do meio do texto, a faixa rolante, "Quem participa", a legenda do mapa e etiquetas repetidas.
- Pedimos **duas visões bem diferentes** (cidadão em tons claros e coral, agente em azul) e os tours para quem chega pela primeira vez.
- O modo demonstração ficou na tela do Cidadão, porque é lá que os ônibus andam, e o chamado automático começa desligado para não encher a API de quem só está visitando.

## 4. Validação das respostas

- **Build e lint** (`npm run build` e `npm run lint`) rodados antes de cada commit, sem erros.
- **Testes da lógica** com scripts no computador: limites dos estados (inclusive os valores exatos nas bordas), regra do 3º alerta (o 1º e o 2º não abrem, o 3º abre, não duplica, uma leitura normal zera) e o caminho (Av. Paulista inteira dá "Evite"; do nº 1 ao 1200, "Pode seguir").
- **Testes no navegador:** cada funcionalidade foi clicada de verdade, no computador e no celular (375 px), conferindo também que nada vaza da tela e que o console fica sem erros.
- **API:** o CRUD foi testado contra o MockAPI real; os registros de teste foram apagados. Para testar o envio de aviso sem criar chamado de verdade, a resposta da API foi simulada só durante o teste.
- **Dados reais:** abrimos cada fonte. Um número que a pesquisa trouxe errado (frota de 13.416 ônibus) foi corrigido para o valor da fonte (13.496).
- **O que ajustamos depois de testar:** o termômetro e a escala cortados no celular, a prioridade que "pulava" ao mudar o status, o ponto do mapa fora do centro, o tour cobrindo o mapa, o mapa que "prendia" o dedo e não deixava rolar a página no celular (agora ele fica parado e o zoom é pelos botões), a lista de todos os pontos que ficava enorme no celular e textos longos demais.

## 5. Análise crítica

**Benefícios.** A IA acelerou muito o trabalho pesado: ligar mapa, simulação e API levaria semanas para um grupo do 1º ano. Ela também foi uma boa professora. Quando perguntávamos "por que os dados atualizam a cada 4 segundos?" ou "como o MockAPI funciona sem login?", a resposta vinha em português simples e nos ajudou a entender e defender as escolhas. Ter testes e medições a cada mudança deu confiança para mexer no projeto sem medo de quebrar.

**Limitações.** A IA não substitui o olhar do grupo. Várias versões ficaram "corretas, mas feias" ou com informação demais, e só percebemos isso abrindo no celular e mostrando para outras pessoas. Ela também errou: comandos de terminal com crases que não rodaram, um enquadramento de mapa que cortava as ruas, um número de fonte errado. Tudo foi pego nos testes, mas mostrou que cada resposta precisa ser conferida.

**Dificuldades.** O mais difícil foi saber pedir: no começo, pedidos vagos geravam soluções grandes demais. Fomos aprendendo a pedir uma coisa por vez, com exemplos ("o °C está separado do 15 no celular"). Outro desafio foi acompanhar tantas mudanças e garantir que conseguimos explicar cada parte. Por isso mantivemos o código comentado e os commits pequenos e revisados.

**Em resumo:** a IA foi uma ótima parceira de desenvolvimento, mas as decisões sobre o que o Pulso deve ser, para quem e por quê foram nossas.
