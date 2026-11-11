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
| **Regra principal** | Na 3ª passagem com o mesmo resultado crítico no mesmo trecho, o sistema abre um chamado sozinho. |

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

Em breve.

## Integrantes

| Nome | RM |
|---|---|
| _(preencher)_ | |

## Uso de IA

Veja o [AI.md](AI.md).
