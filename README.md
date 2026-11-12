# Pulso Web

Global Solution 2026.2 da FIAP, Engenharia de Software (1º ano).
Disciplinas: **Front-End Design** e **Web Development**.

> **Demonstração acadêmica.** Todos os dados são simulados. O app não usa dados pessoais reais.

## Ficha CitizenTech

| | |
|---|---|
| **Problema** | Calor, ruas escuras, buracos e poluição afetam quem anda e pega ônibus em São Paulo, mas quase nunca são medidos trecho a trecho. |
| **Solução** | **Pulso**: caixas de sensores no teto dos ônibus medem calor, iluminação, buracos e poluição em **pontos de medição** ao longo de cada rua, a cada passagem. |
| **Quem usa** | **Cidadão**: vê no mapa onde exatamente está o problema e avisa com o botão "Avisar problema". **Agente da subprefeitura**: vê os chamados no mapa e atende pela fila de prioridade. |
| **Regra principal** | Na 6ª passagem seguida com o mesmo resultado crítico no mesmo ponto, o sistema abre um chamado sozinho, já com o local. |

## Funcionalidades

- **Mapa real:** as 6 ruas (Av. Paulista, R. Augusta, R. da Consolação, Av. Rebouças, R. Oscar Freire e Av. Brig. Luís Antônio) desenhadas sobre o OpenStreetMap com o Leaflet.
- **Medição a cada 100 m:** cada rua tem de 24 a 29 pontos de medição (159 no total). A numeração é simulada (cresce 1 número por metro).
- **Local exato da ocorrência:** luz e pavimento (um poste, um buraco) mostram só o lugar do problema, com margem de 20 números (ex.: "R. Oscar Freire, nº 1036 a 1056"). Calor e ar, que se espalham, mostram o trecho de 100 m (ex.: "Av. Paulista, nº 1201 a 1300"). O resto da rua continua normal.
- **Um ônibus com sensor em cada rua:** os 6 andam ao mesmo tempo. Cada um percorre a sua rua em 3 minutos (uma passagem), indo do começo ao fim e voltando do fim ao começo, para nas paradas de ônibus (a cada 450 m) e o sensor lê cada ponto quando o ônibus passa por ele.
- **Dois jeitos de ver o mapa:** **Todas as ruas** (mapa amplo com os 6 ônibus andando e o resumo das ruas embaixo) e **cada rua separada** (só ela no mapa, com zoom, as paradas e a câmera acompanhando o ônibus).
- **Tela do Cidadão:** letreiro com o local exato do alerta mais urgente, painel da viagem do ônibus da rua (numeração onde ele está, parada, barra do trajeto com as paradas), painel da rua com as ocorrências e todos os pontos (com "Sensor aqui") e o botão **"Avisar problema"**, que abre o formulário (rua, trecho de 100 m da rua escolhida, tipo do problema com a opção "Outros" e descrição) e cria um chamado na API.
- **Tela do Agente:** indicadores, mapa com cada chamado no ponto do problema e fila de atendimento ordenada por status e prioridade, com filtros, mudança de status e exclusão com confirmação.
- **Chamado automático:** na 6ª passagem crítica seguida no mesmo ponto e camada, o app abre um chamado sozinho. Pode ser ligado ou desligado no modo demonstração.
- **Modo demonstração:** caixa recolhível no fim da página para pausar, adiantar 15 s e mudar a velocidade (1x, 2x, 5x, 10x). A 10x, cada passagem leva 18 s, e dá para ver a regra da 6ª passagem acontecer em menos de 2 minutos.
- **Sem conexão:** aviso na tela, simulação parada nas últimas leituras e chamados salvos no navegador.
- **Acessibilidade:** estados com cor, forma, padrão e texto; contraste de 4,5:1 ou mais; botões de 44 px; navegação por teclado; `prefers-reduced-motion`.

## Requisitos do desafio

| Requisito | Onde está |
|---|---|
| React + Vite + Tailwind | `vite.config.js`, `src/index.css` |
| 8 ou mais componentes | 28 componentes em `src/components/` |
| `useState` e `useEffect` | hooks e telas (ex.: `useLeituras`, `useChamados`, `Cidadao.jsx`) |
| 2 ou mais custom hooks | `useChamados`, `useLeituras`, `useOnibus`, `useChamadoAutomatico`, `useOnlineStatus` |
| Separação de responsabilidades | `services/` (HTTP e cache), `utils/` (regras puras), `hooks/` (estado), `components/` (só tela) |
| API externa com CRUD | `services/chamadosService.js`: GET, POST, PUT e DELETE em `/chamados` no MockAPI |

## Tecnologias

- React com Vite (JavaScript e JSX)
- Tailwind CSS
- [Leaflet](https://leafletjs.com) e [react-leaflet](https://react-leaflet.js.org) para o mapa
- Mapa de fundo e traçado das ruas: © [colaboradores do OpenStreetMap](https://www.openstreetmap.org/copyright)
- MockAPI.io como API externa (CRUD de chamados)

## Pré-requisitos

- [Node.js](https://nodejs.org/) 20 ou mais novo (inclui o npm)
- Git

## Instalação

```bash
git clone https://github.com/Lucabaccari/GS-WebDev-FrontEnd.git
cd GS-WebDev-FrontEnd
npm install
```

Crie o arquivo `.env` a partir do modelo:

```bash
cp .env.example .env
```

## Execução

| Comando | O que faz |
|---|---|
| `npm run dev` | Abre o app em modo de desenvolvimento em http://localhost:5173 |
| `npm run build` | Gera a versão final na pasta `dist/` |
| `npm run preview` | Abre a versão final localmente |
| `npm run lint` | Procura erros comuns no código |
| `npm run seed` | Adiciona 6 chamados de exemplo (simulados) na API |
| `npm run seed -- --limpar` | **Apaga todos** os chamados da API e depois adiciona os exemplos |

## Estrutura de pastas

```
src/
  components/   componentes visuais reutilizáveis
  pages/        telas: Cidadão e Agente
  hooks/        custom hooks (estado e efeitos)
  services/     chamadas HTTP à API
  utils/        funções puras (classificação, regras, simulação, mapa e formatação)
  data/         as 6 ruas, o traçado de cada uma e os 5 pontos de medição de cada rua
```

Componentes não chamam a API direto: quem faz isso são os `services/`, usados pelos `hooks/`.

## Deploy

O app é publicado na [Vercel](https://vercel.com), ligada a este repositório do GitHub:

1. Na Vercel, clique em **Add New → Project** e importe o repositório `GS-WebDev-FrontEnd`.
2. A Vercel reconhece o Vite sozinha: comando `npm run build`, pasta `dist`.
3. Em **Environment Variables**, crie `VITE_API_URL` com o mesmo valor do `.env.example`.
4. Clique em **Deploy**. A cada `git push` na `main`, a Vercel publica de novo.

Link do deploy: _(preencher)_

## Limitações (é uma demonstração)

- **A API é uma só para todos.** O MockAPI não tem login: qualquer pessoa vê, muda e exclui qualquer chamado, e a URL da API fica visível no código do navegador. Não há dados pessoais.
- **A simulação roda em cada navegador.** Cada pessoa vê leituras sorteadas diferentes. Por isso o chamado automático começa **desligado**: assim, quem só abre o site não cria chamados.
- **O plano gratuito do MockAPI** tem limite de registros e de requisições.
- **O mapa de fundo** vem dos servidores públicos do OpenStreetMap, feitos para uso leve como este. Sem internet, o fundo não carrega, mas as ruas, os pontos e os chamados continuam na tela.
- **A numeração** ("nº 1036 a 1056") é simulada: cresce 1 número por metro ao longo do traçado real das ruas. Não são endereços medidos de verdade. As paradas de ônibus também são simuladas.
- **Num sistema real** haveria um backend próprio com login (cidadão e agente com permissões diferentes), validação no servidor, sensores enviando dados ao servidor e a regra da 6ª passagem rodando uma vez só, para todos.
- **Os limites dos estados** vêm do PDF do Pulso e ainda precisam ser confirmados nas fontes oficiais (INMET, CETESB, SP156, GeoSampa).

## Integrantes

| Nome | RM |
|---|---|
| _(preencher)_ | |

## Uso de IA

Veja o [AI.md](AI.md).
