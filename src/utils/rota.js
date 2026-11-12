// O trajeto dos ônibus com sensor. Funções puras: só fazem contas de tempo e posição.
//
// Como funciona:
// - Cada uma das 6 ruas tem o seu ônibus com a caixa de sensores. Os 6 andam ao mesmo tempo.
// - Cada ônibus percorre a rua inteira em DURACAO_PASSAGEM_MS (3 minutos): é uma "passagem".
// - Ida e volta: numa passagem ele vai do nº 1 até o fim da rua; na seguinte, volta do fim
//   até o nº 1; e assim por diante.
// - Ele para nas paradas de ônibus (a cada ESPACO_PARADAS_M metros) por PARADA_MS.
//   As paradas ficam no mesmo lugar na ida e na volta.
// - O sensor mede sem parar: cada vez que o ônibus passa pelo meio de um ponto de medição
//   (a cada 100 m), aquele ponto ganha uma leitura nova.
// - Os ônibus começam em momentos diferentes (ATRASO_ENTRE_ONIBUS_MS), para não andarem juntos.
//
// "fracao" é sempre a posição na rua: 0 = nº 1 (começo), 1 = último número (fim).
import { RUAS, pontoNoMetro, nomeDoTrecho } from '../data/ruas.js'
import { posicaoNoCaminho, rumoNoCaminho } from './geo.js'

export const DURACAO_PASSAGEM_MS = 180000 // 3 minutos para percorrer a rua inteira
export const PARADA_MS = 5000 // 5 segundos parado em cada parada de ônibus
export const ESPACO_PARADAS_M = 450 // uma parada de ônibus a cada 450 m (simulado)
const ATRASO_ENTRE_ONIBUS_MS = 30000 // cada ônibus sai 30 s depois do anterior

// Divide os 3 minutos em "etapas": andando de uma fração até outra, ou parado.
// "paradas" aqui são as frações no sentido em que o ônibus anda (0 = onde ele começa).
function montarEtapas(paradas) {
  const tempoAndando = DURACAO_PASSAGEM_MS - paradas.length * PARADA_MS
  const etapas = []
  let de = 0
  for (const fracao of paradas) {
    // As frações são proporcionais à distância, então o tempo andando também é.
    etapas.push({ tipo: 'andando', de, ate: fracao, duracao: tempoAndando * (fracao - de) })
    etapas.push({ tipo: 'parado', fracao, duracao: PARADA_MS })
    de = fracao
  }
  etapas.push({ tipo: 'andando', de, ate: 1, duracao: tempoAndando * (1 - de) })
  return etapas
}

// Monta o trajeto de cada rua: paradas, etapas da ida e da volta, o meio de cada ponto e o atraso.
function montarTrajeto(rua, indice) {
  const paradas = []
  for (let m = ESPACO_PARADAS_M; m < rua.comprimentoM - 150; m += ESPACO_PARADAS_M) {
    paradas.push(m / rua.comprimentoM) // fração da rua onde fica a parada
  }
  // Na volta, o ônibus começa no fim: a parada que fica em 0,8 da rua está a 0,2 do começo da volta.
  const paradasNaVolta = paradas.map((p) => 1 - p).sort((a, b) => a - b)

  return {
    ruaId: rua.id,
    ruaNome: rua.nome,
    caminho: rua.caminho,
    comprimentoM: rua.comprimentoM,
    paradas,
    etapasIda: montarEtapas(paradas),
    etapasVolta: montarEtapas(paradasNaVolta),
    // Fração da rua onde fica o meio de cada ponto de medição (é ali que o sensor lê).
    meiosDosPontos: rua.pontos.map((p) => ({ pontoId: p.id, fracao: (p.inicioM + p.fimM) / 2 / rua.comprimentoM })),
    atrasoMs: indice * ATRASO_ENTRE_ONIBUS_MS,
  }
}

export const TRAJETOS = RUAS.map(montarTrajeto)

export function trajetoDaRua(ruaId) {
  return TRAJETOS.find((t) => t.ruaId === ruaId)
}

// Quanto do caminho já foi feito (0 a 1) e se está parado, num momento da passagem (0 a 3 min).
function avancoNaPassagem(etapas, naPassagemMs) {
  let acumulado = 0
  for (const etapa of etapas) {
    if (naPassagemMs < acumulado + etapa.duracao) {
      const dentro = (naPassagemMs - acumulado) / etapa.duracao // 0 a 1 dentro da etapa
      if (etapa.tipo === 'parado') return { avanco: etapa.fracao, parado: true }
      return { avanco: etapa.de + (etapa.ate - etapa.de) * dentro, parado: false }
    }
    acumulado += etapa.duracao
  }
  return { avanco: 1, parado: false }
}

// Tempo "do ônibus" daquela rua: o tempo geral menos o atraso de saída dele.
function tempoDoOnibus(trajeto, tempoMs) {
  // Somar duas passagens evita tempo negativo no começo (o ônibus já estava andando)
  // e faz a contagem de passagens começar em 1 para todos os ônibus.
  return tempoMs - trajeto.atrasoMs + 2 * DURACAO_PASSAGEM_MS
}

// Onde está o ônibus de uma rua num certo momento (tempoMs = tempo desde que o app abriu).
export function estadoDoOnibus(trajeto, tempoMs) {
  const t = tempoDoOnibus(trajeto, tempoMs)
  const passagem = Math.floor(t / DURACAO_PASSAGEM_MS) // número da passagem
  const naPassagemMs = t % DURACAO_PASSAGEM_MS
  const indo = passagem % 2 === 1 // passagens ímpares = ida (do nº 1 ao fim); pares = volta (do fim ao nº 1)

  const { avanco, parado } = avancoNaPassagem(indo ? trajeto.etapasIda : trajeto.etapasVolta, naPassagemMs)
  const fracao = indo ? avanco : 1 - avanco // posição na rua (0 = nº 1)

  // Quantas paradas ele já passou nesta passagem (para dizer "parada 2 de 5").
  const paradasPassadas = trajeto.paradas.filter((p) => (indo ? p < fracao - 0.0001 : p > fracao + 0.0001)).length
  const numero = Math.max(1, Math.round(fracao * trajeto.comprimentoM)) // numeração (simulada) onde ele está
  const ponto = pontoNoMetro(trajeto.ruaId, Math.min(numero, trajeto.comprimentoM - 1))

  return {
    ruaId: trajeto.ruaId,
    ruaNome: trajeto.ruaNome,
    caminho: trajeto.caminho,
    passagem,
    indo,
    fracao,
    parado,
    posicao: posicaoNoCaminho(trajeto.caminho, fracao),
    // Na volta o ônibus anda ao contrário do traçado: gira o ícone meia volta (180 graus).
    rumo: rumoNoCaminho(trajeto.caminho, fracao) + (indo ? 0 : 180),
    numero, // número exato (usado na rua em foco)
    trecho: nomeDoTrecho(ponto.numeroDe, ponto.numeroAte), // trecho de 100 m (usado nos resumos)
    // Pedaço da rua já percorrido nesta passagem, para desenhar o rastro: [de, até].
    rastro: indo ? [0, fracao] : [fracao, 1],
    numeroParada: parado ? paradasPassadas + 1 : null, // em qual parada está (1, 2, 3...)
    totalParadas: trajeto.paradas.length,
    faltaMs: DURACAO_PASSAGEM_MS - naPassagemMs, // quanto falta para terminar a passagem
  }
}

// Quais pontos o ônibus passou num pedaço de uma passagem, de "de" até "ate" (frações da rua).
function pontosEntre(trajeto, de, ate) {
  const menor = Math.min(de, ate)
  const maior = Math.max(de, ate)
  return trajeto.meiosDosPontos.filter((m) => m.fracao > menor && m.fracao <= maior).map((m) => m.pontoId)
}

// Quais pontos de medição o ônibus de uma rua passou entre dois momentos. O sensor lê esses pontos.
// Se ele chegou numa ponta da rua e virou no meio do intervalo, conta o fim da passagem anterior
// e o começo da nova (o ponto da ponta pode ser lido duas vezes: na chegada e na saída).
export function pontosPassados(trajeto, tempoAntesMs, tempoDepoisMs) {
  const antes = estadoDoOnibus(trajeto, tempoAntesMs)
  const depois = estadoDoOnibus(trajeto, tempoDepoisMs)
  if (antes.passagem === depois.passagem) return pontosEntre(trajeto, antes.fracao, depois.fracao)

  const pontaDaVirada = antes.indo ? 1 : 0 // a ida termina no fim (1); a volta termina no começo (0)
  return [
    ...pontosEntre(trajeto, antes.fracao, pontaDaVirada),
    ...pontosEntre(trajeto, pontaDaVirada, depois.fracao),
  ]
}
