// Passos do tour da tela do Cidadão (no máximo 6).
// "alvo" é o valor do atributo data-tour do elemento que o passo destaca.
// Sem alvo, o passo aparece no meio da tela (boas-vindas).
// "estados": mostra os 3 pictogramas de estado no cartão (substitui a legenda do mapa).
export const PASSOS_TOUR_CIDADAO = [
  {
    titulo: 'Bem-vindo ao Pulso',
    texto:
      'Os ônibus com sensor medem calor, luz, buracos e poluição nas ruas. Aqui você vê, em tempo real, onde tem problema. Os dados são simulados.',
    estados: true,
  },
  {
    alvo: 'ruas',
    titulo: 'Escolha a rua',
    texto: 'Veja todas as ruas juntas ou uma só. Embaixo do nome aparece o trecho onde o ônibus está agora.',
  },
  {
    alvo: 'camadas',
    titulo: 'Escolha o que medir',
    texto: 'Mostre tudo (Geral) ou só uma camada: calor, luz à noite, pavimento ou ar.',
  },
  {
    alvo: 'mapa',
    titulo: 'Acompanhe no mapa',
    texto: 'Os ônibus andam medindo. Cada símbolo é um lugar com problema: toque nele para ver o número exato da rua.',
  },
  {
    alvo: 'avisar',
    titulo: 'Avise um problema',
    texto: 'Viu um buraco, um poste apagado ou outra coisa? Avise aqui. O aviso vira um chamado para a subprefeitura.',
  },
  {
    alvo: 'resumo',
    titulo: 'Resumo das ruas',
    texto: 'Cada rua mostra as ocorrências, com o tipo e o estado, e onde está o ônibus. Use "Ver rua" para seguir o ônibus.',
  },
]
