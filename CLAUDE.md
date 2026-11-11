# CLAUDE.md — Pulso Web

Este arquivo dá ao Claude Code o contexto do projeto. Ele vai na **raiz do repositório**.

## O que é este projeto

Trabalho da Global Solution 2026.2 da FIAP (Engenharia de Software, 1º ano), tema CitizenTech. O app web é usado nas disciplinas **Front-End Design** e **Web Development** (mesma aplicação, entregas separadas).

**Pulso:** caixas de sensores no teto dos ônibus de São Paulo medem calor, iluminação, buracos e poluição por trecho da rua. O **Pulso Web** é o app que mostra isso:

- **Cidadão:** mapa da linha com o estado de cada trecho, letreiro, e o botão "Solicitar parada" para avisar um problema.
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
- No mínimo **2 custom hooks** (usamos 3: `useChamados`, `useLeituras`, `useOnlineStatus`).
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
  hooks/        useChamados.js, useLeituras.js, useOnlineStatus.js
  services/     api.js, chamadosService.js (só chamadas HTTP)
  utils/        classificar.js, formatadores.js (funções puras)
  data/         linha.js (os 6 trechos)
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
| `trechoId` | Number, de 1 a 6 |
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

- Na **3ª passagem** com o mesmo resultado crítico no mesmo trecho, nasce um chamado automático (`origem = automatico`).
- Leitura inválida (vazia, `NaN`, fora de faixa) não vira estado: tratar como "sem dados".
- Trechos (confirmar com a equipe): 1 Av. Paulista, 2 R. Augusta, 3 R. da Consolação, 4 Av. Rebouças, 5 R. Oscar Freire, 6 Av. Brig. Luís Antônio.

## Direção visual (guia de estilo aprovado pelo grupo)

Conceito: **o app como itinerário**, inspirado na faixa do Metrô, no totem aceso, no letreiro de LED dos ônibus, nas placas de trânsito e nas letras populares. Inspiração, **nunca cópia de logotipo** do Metrô ou da SPTrans.

- Cores: concreto `#E9E6DF` (fundo), asfalto `#1B1C1E` (texto), amarelo `#FFC400` (atenção), vermelho `#D7261E` (crítico), verde `#17753F` (normal). Letreiro: âmbar `#FFB000` sobre `#0E0E0F`.
- Fontes: **Archivo** (títulos e texto, condensada nos títulos) e **Doto** (só o letreiro).
- Estados sempre com **cor + forma + padrão + texto**: normal = visto e fita lisa; atenção = losango e fita listrada; crítico = octógono e fita diagonal. Nunca só cor.
- Bordas de 2 a 3 px em asfalto, sombras duras (sem blur), pictogramas soltos (sem círculo atrás).
- Botão principal do cidadão: **"Solicitar parada"** (vermelho), com resposta no letreiro "Parada solicitada".
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
