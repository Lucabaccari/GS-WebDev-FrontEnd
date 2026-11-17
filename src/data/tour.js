// Passos dos tours guiados (no máximo 6 em cada tela).
// - alvo: o valor do atributo data-tour do elemento que o passo destaca. Sem alvo, o cartão
//   aparece no meio da tela (boas-vindas).
// - estados: mostra os 3 pictogramas de estado no cartão (substitui a legenda do mapa).
// - visao (só no Cidadão): o que o mapa mostra nesse passo: 'todas' ou o id de uma rua.
//   A tela troca a visão antes de destacar o elemento.
// - abrirChamado (só no Agente): abre o primeiro chamado da fila nesse passo.

export const PASSOS_TOUR_CIDADAO = [
  {
    visao: 'todas',
    titulo: 'Bem-vindo ao Pulso',
    texto:
      'Os ônibus com sensor medem calor, luz, buracos e poluição nas ruas. Aqui você vê, em tempo real, onde tem problema. Os dados são simulados.',
    estados: true,
  },
  {
    visao: 'todas',
    alvo: 'ruas',
    titulo: 'Escolha a rua',
    texto: 'Veja todas as ruas juntas ou uma só. Embaixo do nome aparece o trecho onde o ônibus está agora. Abaixo do mapa, um resumo de cada rua.',
  },
  {
    visao: 'todas',
    alvo: 'camadas',
    titulo: 'Escolha o que medir',
    texto: 'Mostre tudo (Geral) ou só uma camada: calor, luz à noite, pavimento ou ar.',
  },
  {
    visao: 'todas',
    alvo: 'mapa',
    titulo: 'Acompanhe no mapa',
    texto: 'Os ônibus andam medindo. Cada símbolo é um lugar com problema: toque nele para ver o número exato da rua.',
  },
  {
    visao: 'todas',
    alvo: 'avisar',
    titulo: 'Avise um problema',
    texto: 'Viu um buraco, um poste apagado ou outra coisa? Avise aqui. O aviso vira um chamado para a subprefeitura.',
  },
  {
    visao: 1, // abre a Av. Paulista para mostrar o detalhe de uma rua
    alvo: 'rua-detalhe',
    titulo: 'Veja uma rua de perto',
    texto:
      'Ao tocar numa rua, o mapa aproxima e segue o ônibus. Aqui ao lado aparecem a viagem dele, as paradas e cada trecho de 100 m, com o número exato do problema.',
  },
]

export const PASSOS_TOUR_AGENTE = [
  {
    titulo: 'Painel da subprefeitura',
    texto:
      'Aqui chegam os chamados abertos pelos sensores dos ônibus e pelos cidadãos, com o local exato do problema. Os dados são simulados.',
  },
  {
    alvo: 'indicadores',
    titulo: 'Indicadores',
    texto: 'Quantos chamados estão abertos, em atendimento e resolvidos, o tempo médio para resolver e quem abriu cada um.',
  },
  {
    alvo: 'filtros',
    titulo: 'Filtre a fila',
    texto: 'Mostre só um status, um tipo de problema ou uma rua. "Limpar" volta a mostrar tudo.',
  },
  {
    alvo: 'fila',
    titulo: 'Fila de atendimento',
    texto: 'Os chamados mais recentes vêm primeiro. Cada linha mostra o ícone do problema, o local, a prioridade e o status.',
  },
  {
    alvo: 'chamado-aberto',
    abrirChamado: true,
    titulo: 'Abra um chamado',
    texto: 'Ao tocar num chamado, aparece o mapa com o ponto do problema. Ali você muda o status (aberto, em atendimento, resolvido) ou exclui.',
  },
]
