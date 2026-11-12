# CLAUDE.md — Pulso Web

Este arquivo dá ao Claude Code o contexto do projeto. Ele vai na **raiz do repositório**.

## O que é este projeto

Trabalho da Global Solution 2026.2 da FIAP (Engenharia de Software, 1º ano), tema CitizenTech. O app web é usado nas disciplinas **Front-End Design** e **Web Development** (mesma aplicação, entregas separadas).

**Pulso:** caixas de sensores no teto dos ônibus de São Paulo medem calor, iluminação, buracos e poluição por trecho da rua. O **Pulso Web** é o app que mostra isso:

- **Cidadão:** mapa da linha com o estado de cada trecho, letreiro, e o botão "Avisar problema".
- **Agente da subprefeitura:** painel de chamados e indicadores.

É uma **demonstração acadêmica**: dados simulados, nada de dados pessoais reais.

## Quem está trabalhando

O aluno é do 1º ano e precisa **explicar cada parte do código ao professor**. Por isso:

- Explique em português simples o que cada arquivo e função faz, em poucas linhas.
- Prefira código simples e legível a soluções "espertas".
- Comente o código nos trechos não óbvios, em português.
- Faça uma coisa pequena por vez.

## Requisitos do desafio (obrigatórios)

- React com **Vite** (JavaScript, JSX) e **Tailwind CSS**.
- No mínimo **8 componentes** React organizados e reutilizáveis.
- **useState** e **useEffect** obrigatórios.
- No mínimo **2 custom hooks** (usamos 5: `useChamados`, `useLeituras`, `useOnibus`, `useChamadoAutomatico`, `useOnlineStatus`).
- **Separação de responsabilidades:** lógica de negócio e acesso a dados fora dos componentes visuais.
- **API externa com CRUD completo** (criar, consultar, atualizar, excluir).
- Funcionalidades reais ligadas ao tema. **Não pode ser só uma interface estática.**
- Git com no mínimo 15 commits significativos. O `PLANO-DE-COMMITS.md` detalha o primeiro lote de 10 e prevê os seguintes.
- `README.md` (descrição, pré-requisitos, instalação e execução) e `AI.md` na raiz.
- Deploy publicado.

## Estrutura de pastas

```
src/
  components/   componentes visuais reutilizáveis
  pages/        telas: Cidadao.jsx, Agente.jsx
  hooks/        useChamados.js, useLeituras.js, useOnibus.js, useChamadoAutomatico.js, useOnlineStatus.js
  services/     api.js, chamadosService.js, cache.js (HTTP e cópia local)
  utils/        classificar.js, regras.js, simulacao.js, chamados.js, indicadores.js, mensagens.js, formatadores.js, geo.js, icones.js (funções puras)
  data/         ruas.js (as 6 ruas, traçado do OpenStreetMap e 5 pontos de medição por rua)
```

Regra: componentes **não** chamam `fetch`. Quem chama é `services/`, e os hooks usam os services.

## API (MockAPI.io)

Base: `https://6af3c56455a1de7dcf033b9a.mockapi.io/api/v1`
Recurso: `/chamados`. A URL fica em `VITE_API_URL` no `.env` (e no `.env.example`, sem segredo).

Campos de um chamado (todos String, exceto os marcados):

| Campo | Valores |
|---|---|
| `id` | gerado pelo MockAPI |
| `tipo` | `calor`, `luz`, `pavimento`, `ar` |
| `trechoId` | Number, de 1 a 6 (é o id da **rua**; o nome do campo ficou por compatibilidade) |
| `pontoId` | id do ponto de medição, ex.: `'5-3'` (3º ponto da rua 5) |
| `pontoNome` | ex.: `altura do nº 900` (rótulo simulado) |
| `lat`, `lng` | Number, coordenadas do ponto (para o mapa) |
| `trechoNome` | nome do trecho |
| `status` | `aberto`, `em_atendimento`, `resolvido` |
| `prioridade` | `baixa`, `media`, `alta` |
| `origem` | `automatico`, `cidadao` |
| `descricao` | texto curto |
| `passagens` | Number, passagens com o mesmo resultado |
| `criadoEm` | data e hora ISO |
| `resolvidoEm` | data e hora ISO, vazio enquanto não resolvido |

Use `GET`, `POST`, `PUT` (envia o objeto completo) e `DELETE`. O plano gratuito do MockAPI tem limites: não crie mais de 2 recursos.

## Regras de negócio (do PDF do Pulso)

Estados por camada. Os limites ainda precisam ser confirmados nas fontes (INMET, CETESB, SP156, GeoSampa) e ficam centralizados em `utils/classificar.js`.

| Camada | Normal | Atenção | Crítico |
|---|---|---|---|
| Calor (°C) | abaixo de 30 | 30 a 35 | acima de 35 |
| Luz à noite (lux) | 20 ou mais | 5 a 20 | abaixo de 5 |
| Pavimento (pico, g) | abaixo de 1,5 | 1,5 a 2,0 | acima de 2,0 |
| Ar (PM2.5, µg/m³) | até 25 | 25 a 50 | acima de 50 |

- Na **6ª passagem** seguida com o mesmo resultado crítico no mesmo trecho e camada, nasce um chamado automático (`origem = automatico`). O PDF falava em 3ª; o grupo decidiu usar 6ª. O número fica em `PASSAGENS_PARA_CHAMADO` (`utils/regras.js`).
- Leitura inválida (vazia, `NaN`, fora de faixa) não vira estado: tratar como "sem dados".
- Ruas: 1 Av. Paulista, 2 R. Augusta, 3 R. da Consolação, 4 Av. Rebouças, 5 R. Oscar Freire, 6 Av. Brig. Luís Antônio. Cada rua tem um **ponto de medição a cada 100 m** (`ESPACO_ENTRE_PONTOS_M`), com numeração simulada (1 número por metro).
- **O estado é por ponto, não pela rua inteira.** A rua mostra um resumo (quantos pontos em cada estado). A regra da 6ª passagem conta por ponto.
- **Local da ocorrência:** luz e pavimento mostram só o lugar exato, com margem de 20 números (`localDaOcorrencia` em `utils/simulacao.js`). Calor e ar mostram o trecho de 100 m do ponto.
- Mapa: Leaflet + react-leaflet, fundo do OpenStreetMap (com atribuição), em tons de cinza no CSS.
- **Um ônibus com sensor em cada rua**, os 6 ao mesmo tempo (`utils/rota.js`): 3 minutos por passagem (`DURACAO_PASSAGEM_MS`), em ida e volta (do nº 1 ao fim, depois do fim ao nº 1), com paradas de ônibus simuladas a cada 450 m (`PARADA_MS` = 5 s). O sensor lê cada ponto quando o ônibus passa pelo meio dele (`useOnibus` avisa, `useLeituras` registra). "Passagem" de um ponto = cada vez que o ônibus passa por ele.
- Visões do mapa: "Todas as ruas" (mapa amplo com os 6 ônibus) e cada rua separada (as outras somem; zoom, paradas e câmera acompanhando o ônibus).

## Direção visual (guia de estilo aprovado pelo grupo)

Conceito: **o app como itinerário**, inspirado na faixa do Metrô, no totem aceso, no letreiro de LED dos ônibus, nas placas de trânsito e nas letras populares. Inspiração, **nunca cópia de logotipo** do Metrô ou da SPTrans.

- Cores: concreto `#E9E6DF` (fundo), asfalto `#1B1C1E` (texto), amarelo `#FFC400` (atenção), vermelho `#D7261E` (crítico), verde `#17753F` (normal). Letreiro: âmbar `#FFB000` sobre `#0E0E0F`.
- Fontes: **Archivo** (títulos e texto, condensada nos títulos) e **Doto** (só o letreiro).
- Estados sempre com **cor + forma + padrão + texto**: normal = visto e fita lisa; atenção = losango e fita listrada; crítico = octógono e fita diagonal. Nunca só cor.
- Bordas de 2 a 3 px em asfalto, sombras duras (sem blur), pictogramas soltos (sem círculo atrás).
- Botão principal do cidadão: **"Avisar problema"** (vermelho), com resposta no letreiro "Aviso recebido". (Antes era "Solicitar parada"; o aluno trocou por fazer mais sentido.)
- Formulário: rua, trecho (os trechos de 100 m da rua escolhida), tipo (4 camadas + "Outros") e descrição.
- Numeração exata (metro a metro) só na rua em foco; nos resumos, o trecho de 100 m.
- Chamado = **bilhete**: protocolo, picote, carimbo de status, etiqueta "Dados simulados".
- Texto curto, verbo no começo. Ex.: "Trecho escuro. Prefira outro caminho agora."
- **Evitar:** gradientes de fundo, vidro fosco, ícone em bolinha, emoji, Inter e Space Grotesk, neon, linha de KPIs com setinha.

## Acessibilidade e realidade de uso

- Contraste mínimo de 4,5:1 no texto. Botões com no mínimo 44 px.
- Respeitar `prefers-reduced-motion`.
- Funciona bem no celular. Navegável por teclado, com `<button>` e `<a>` reais.
- Sem conexão: mostrar as últimas leituras com aviso, em vez de quebrar.

## Como trabalhar neste repositório

- Comandos: `npm install`, `npm run dev`, `npm run build`, `npm run lint`.
- **Não faça `git commit` sozinho.** Mostre as alterações, proponha a mensagem de commit e espere eu aprovar.
- Mensagens de commit no padrão `tipo(escopo): descrição`, em português (veja `PLANO-DE-COMMITS.md`). Siga a ordem do plano.
- Um commit = uma ideia pequena. Nunca commite `.env`, `node_modules/` ou `dist/`.
- Antes de propor o commit: rode o app ou o build e confirme que não há erro.
- Ao fim de cada sessão, me entregue um resumo para o `AI.md`: o que a IA sugeriu, o que eu mudei e como validei.
- Não invente dados reais nem números de fontes. Use dados simulados e diga isso na interface.
