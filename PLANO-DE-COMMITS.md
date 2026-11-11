# Plano de commits — Pulso Web

São **10 commits planejados**, numa lista só, do começo ao fim do projeto. Cada um deixa o app rodando e entrega algo que dá para ver ou testar.

> **Atenção ao requisito:** o PDF do desafio pede **no mínimo 15 commits significativos** no repositório. Como o plano tem 10, os outros 5 ou mais devem vir naturalmente durante o trabalho: correções (`fix`), ajustes de visual (`style`), refatorações (`refactor`) e melhorias na documentação (`docs`) que aparecem ao testar, e os commits dos colegas do grupo. Não vale quebrar um commit em pedaços só para inflar o número.

## Regras do grupo

1. **Um commit = uma entrega que funciona.** Depois de cada commit, `npm run dev` deve abrir sem erro.
2. **Mensagem no formato `tipo(escopo): o que mudou`**, em português, no presente. Tipos: `feat` (funcionalidade), `fix` (correção), `docs`, `style` (visual e acessibilidade), `refactor`, `chore` (configuração).
3. **Nada de commit do tipo "fiz tudo".** O histórico faz parte da nota.
4. **Nunca commitar** `.env`, `node_modules/` ou `dist/`. Só o `.env.example`.
5. **Todo mundo do grupo commita.** Dividam as entregas entre os integrantes, cada um na própria branch, com merge na `main`.
6. Antes de cada commit: rodar o app, conferir no navegador e ler o `git diff`.

## Os 10 commits

| # | Commit | O que entra | Ao final, o app… |
|---|---|---|---|
| 1 | `chore: inicia projeto com Vite, React e Tailwind` | `npm create vite`, `.gitignore`, Tailwind com as cores e fontes do guia (concreto, asfalto, amarelo, vermelho, verde, Archivo e Doto) | abre uma página inicial com o visual do guia |
| 2 | `chore: cria estrutura de pastas, .env.example, README e AI.md` | Pastas `components/`, `hooks/`, `services/`, `utils/`, `data/`, `pages/`, `VITE_API_URL`, ficha da CitizenTech no README e rascunho do AI.md | continua abrindo, com o repositório organizado e documentado |
| 3 | `feat(utils,data): classifica leituras e define a linha com 6 trechos` | `classificar.js` com os limites do PDF e tratamento de leitura inválida, e `linha.js` com os 6 trechos | tem a lógica de estados pronta (ainda sem tela) |
| 4 | `feat(services,hooks): cria cliente da API e useChamados com CRUD` | `api.js`, `chamadosService.js` (`GET`, `POST`, `PUT`, `DELETE`) e o hook `useChamados` com loading e erro | lê e grava chamados no MockAPI (testado no console ou numa tela provisória) |
| 5 | `feat(hooks,ui): cria useLeituras e mostra os trechos nos 3 estados` | `useLeituras` (simula as passagens), `StatusPicto` e `CartaoTrecho` com visto, losango e octógono | mostra os 6 trechos mudando de estado |
| 6 | `feat(ui): monta a tela do Cidadão com mapa, letreiro e abas` | `Cabecalho`, `Abas`, `LetreiroLED`, `MapaEsquematico` em SVG, `Legenda` e `SeletorCamada` | tem a tela do Cidadão completa para leitura |
| 7 | `feat(chamados): CRUD de chamados na interface` | `BilheteChamado`, `ListaChamados`, `BotaoParada`, `FormChamado`, atualizar status, excluir com confirmação e `FiltrosChamados` | cria, lista, atualiza e exclui chamados de verdade |
| 8 | `feat(agente,regras): painel do Agente e chamado automático` | Tela do Agente com `Indicadores`, e a regra da 6ª passagem crítica que abre chamado com `origem = automatico` | mostra o painel da subprefeitura e gera chamados sozinho |
| 9 | `feat(demo,offline): modo demonstração, aviso offline e acessibilidade` | Pausa e velocidade da demo, `useOnlineStatus` com `BannerOffline` e cache, foco, contraste, teclado e ajustes de celular | tem a demo para o vídeo, funciona sem sinal e no celular |
| 10 | `chore(deploy): seed, deploy e documentação final` | Script de chamados de exemplo, configuração do deploy, README completo e AI.md final | está no ar, com README e AI.md prontos para entregar |

Bônus, só se sobrar tempo: mapa real com Leaflet, em um commit à parte.

## Calendário sugerido (prazo final: quinta 19/11, 23h55; 20/11 é feriado)

| Dia | Commits |
|---|---|
| 11 e 12/11 | 1 a 4 |
| 13 e 14/11 | 5 e 6 |
| 15 e 16/11 | 7 e 8 |
| 17/11 | 9 |
| 18/11 | 10 e testes finais |
| 19/11 | Folga. Enviar cedo, sem esperar as 23h55 |

## Checklist final de entrega (por disciplina, em tarefas separadas no Teams)

- [ ] Link do repositório GitHub privado, com os dois professores com acesso de **escrita** (testar o acesso)
- [ ] Arquivo ZIP do projeto (sem `node_modules`)
- [ ] `README.md` com descrição, pré-requisitos e instruções de instalação e execução
- [ ] `AI.md` na raiz do projeto
- [ ] Link do deploy (o PDF lista no Front-End; envie nas duas disciplinas)
- [ ] **Mínimo de 15 commits** significativos no histórico (conferir com `git log --oneline | wc -l`)
- [ ] 8 ou mais componentes, `useState`, `useEffect`, 2 ou mais custom hooks, CRUD completo e Tailwind
