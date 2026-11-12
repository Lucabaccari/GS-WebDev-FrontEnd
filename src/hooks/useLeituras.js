// Custom hook que guarda as leituras do sensor em cada ponto de medição.
// Os ônibus (useOnibus) chamam registrarLeituras([ids]) quando passam pelos pontos:
// aí o sensor mede as 4 camadas daqueles pontos, e só deles.
import { useState } from 'react'
import { RUAS, PONTOS, nomeDoTrecho } from '../data/ruas.js'
import { gerarPassagem, gerarLeituraPonto, localDaOcorrencia, CAMADAS_DE_LUGAR } from '../utils/simulacao.js'
import { classificar, estadoMaisGrave } from '../utils/classificar.js'
import { atualizarSequencias, atualizarSequenciaPonto } from '../utils/regras.js'
import { posicaoNoCaminho, trechoDoCaminho } from '../utils/geo.js'

const CAMADAS_IDS = ['calor', 'luz', 'pavimento', 'ar']

// Local de cada camada em cada ponto: o nome ("nº 1036 a 1056"), o centro e o pedaço da rua.
// Não depende das leituras, então é calculado uma vez só, quando o app abre.
const LOCAIS = {}
for (const rua of RUAS) {
  for (const ponto of rua.pontos) {
    LOCAIS[ponto.id] = {}
    for (const camada of CAMADAS_IDS) {
      const local = localDaOcorrencia({ ...ponto, ruaId: rua.id }, camada)
      const de = local.inicioM / rua.comprimentoM
      const ate = local.fimM / rua.comprimentoM
      LOCAIS[ponto.id][camada] = {
        nome: nomeDoTrecho(local.numeroDe, local.numeroAte),
        centro: posicaoNoCaminho(rua.caminho, (de + ate) / 2),
        trecho: trechoDoCaminho(rua.caminho, de, ate),
        deLugar: CAMADAS_DE_LUGAR.includes(camada) && local.fimM - local.inicioM < 50, // é um lugar exato?
      }
    }
  }
}

// Junta cada ponto com sua leitura, estados, sequência, locais e quantas vezes já foi lido.
function montarPonto(ponto, dados) {
  const valores = dados.leituras[ponto.id]
  const estados = {}
  for (const camada of CAMADAS_IDS) {
    estados[camada] = classificar(camada, valores[camada])
  }
  return {
    ...ponto,
    nome: nomeDoTrecho(ponto.numeroDe, ponto.numeroAte), // ex.: 'nº 1001 a 1100'
    leituras: valores,
    estados,
    locais: LOCAIS[ponto.id],
    sequencias: dados.sequencias[ponto.id], // passagens críticas seguidas por camada
    passagens: dados.passagens[ponto.id], // quantas leituras este ponto já teve
    estadoGeral: estadoMaisGrave(Object.values(estados)), // o pior entre as 4 camadas
  }
}

// Quando o app abre, todos os pontos já têm a leitura da passagem anterior dos ônibus.
function dadosIniciais() {
  const leituras = gerarPassagem(PONTOS)
  return {
    leituras,
    sequencias: atualizarSequencias({}, leituras, PONTOS),
    passagens: Object.fromEntries(PONTOS.map((p) => [p.id, 1])),
    contagem: 0, // total de leituras feitas desde que o app abriu
  }
}

export function useLeituras() {
  // A função dentro do useState só roda na primeira vez.
  const [dados, setDados] = useState(dadosIniciais)

  // O sensor lê alguns pontos: gera os valores e atualiza só esses pontos.
  function registrarLeituras(pontoIds) {
    if (pontoIds.length === 0) return
    const novas = pontoIds.map((id) => [id, gerarLeituraPonto(id)])
    // "anterior" é o estado de antes; o "..." copia tudo e trocamos só os pontos lidos.
    setDados((anterior) => {
      const proximo = {
        leituras: { ...anterior.leituras },
        sequencias: { ...anterior.sequencias },
        passagens: { ...anterior.passagens },
        contagem: anterior.contagem + novas.length,
      }
      for (const [id, leitura] of novas) {
        proximo.leituras[id] = leitura
        proximo.sequencias[id] = atualizarSequenciaPonto(anterior.sequencias[id], leitura)
        proximo.passagens[id] = anterior.passagens[id] + 1
      }
      return proximo
    })
  }

  // Ruas com os pontos prontos. É uma conta, não um estado: refeita a cada redesenho.
  const ruas = RUAS.map((rua) => ({
    ...rua,
    pontos: rua.pontos.map((ponto) => montarPonto({ ...ponto, ruaId: rua.id, ruaNome: rua.nome }, dados)),
  }))
  // Lista "achatada" com todos os pontos de todas as ruas (útil para regras e letreiro).
  const pontos = ruas.flatMap((rua) => rua.pontos)

  return { ruas, pontos, contagem: dados.contagem, registrarLeituras }
}
