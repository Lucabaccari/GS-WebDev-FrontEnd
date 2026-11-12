# Pulso Web

Global Solution 2026.2 da FIAP, Engenharia de Software (1º ano).
Disciplinas: **Front-End Design** e **Web Development**.

> **Demonstração acadêmica.** Todos os dados são simulados. O app não usa dados pessoais reais.

## Ficha CitizenTech

| | |
|---|---|
| **Problema** | Calor, ruas escuras, buracos e poluição afetam quem anda e pega ônibus em São Paulo, mas quase nunca são medidos trecho a trecho. |
| **Solução** | **Pulso**: caixas de sensores no teto dos ônibus medem calor, iluminação, buracos e poluição por trecho da rua a cada passagem. |
| **Quem usa** | **Cidadão**: vê o estado de cada trecho da linha e avisa um problema com o botão "Solicitar parada". **Agente da subprefeitura**: acompanha os chamados e os indicadores. |
| **Regra principal** | Na 6ª passagem seguida com o mesmo resultado crítico no mesmo trecho, o sistema abre um chamado sozinho. |

## Funcionalidades

- **Tela do Cidadão:** letreiro com o alerta mais urgente, mapa da linha em SVG, cartões dos 6 trechos com as 4 camadas e botão **"Solicitar parada"** para avisar um problema (cria um chamado na API).
- **Tela do Agente:** indicadores (abertos, em atendimento, resolvidos, tempo médio, por tipo e por origem) e lista de chamados em forma de bilhete, com filtros, mudança de status e exclusão com confirmação.
- **Chamado automático:** na 6ª passagem crítica seguida no mesmo trecho e camada, o app abre um chamado sozinho. Pode ser ligado ou desligado no modo demonstração.
- **Modo demonstração:** pausar, avançar uma passagem e mudar a velocidade da simulação.
- **Sem conexão:** aviso na tela, simulação parada nas últimas leituras e chamados salvos no navegador.
- **Acessibilidade:** estados com cor, forma, padrão e texto; contraste de 4,5:1 ou mais; botões de 44 px; navegação por teclado; `prefers-reduced-motion`.

## Requisitos do desafio

| Requisito | Onde está |
|---|---|
| React + Vite + Tailwind | `vite.config.js`, `src/index.css` |
| 8 ou mais componentes | 18 componentes em `src/components/` |
| `useState` e `useEffect` | hooks e telas (ex.: `useLeituras`, `useChamados`, `Cidadao.jsx`) |
| 2 ou mais custom hooks | `useChamados`, `useLeituras`, `useChamadoAutomatico`, `useOnlineStatus` |
| Separação de responsabilidades | `services/` (HTTP e cache), `utils/` (regras puras), `hooks/` (estado), `components/` (só tela) |
| API externa com CRUD | `services/chamadosService.js`: GET, POST, PUT e DELETE em `/chamados` no MockAPI |

## Tecnologias

- React com Vite (JavaScript e JSX)
- Tailwind CSS
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
  utils/        funções puras (classificação e formatação)
  data/         dados fixos da linha (os 6 trechos)
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
- **Num sistema real** haveria um backend próprio com login (cidadão e agente com permissões diferentes), validação no servidor, sensores enviando dados ao servidor e a regra da 6ª passagem rodando uma vez só, para todos.
- **Os limites dos estados** vêm do PDF do Pulso e ainda precisam ser confirmados nas fontes oficiais (INMET, CETESB, SP156, GeoSampa).

## Integrantes

| Nome | RM |
|---|---|
| _(preencher)_ | |

## Uso de IA

Veja o [AI.md](AI.md).
