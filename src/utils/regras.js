// Regra do chamado automático. Funções puras: só fazem contas, não chamam a API.
//
// Regra: quando o mesmo PONTO de uma rua dá resultado CRÍTICO na mesma camada por
// PASSAGENS_PARA_CHAMADO passagens seguidas, o sistema abre um chamado sozinho,
// já dizendo o ponto exato do problema.
// (O PDF do Pulso falava em 3 passagens; o grupo decidiu usar 6.)
import { classificar } from './classificar.js'

export const PASSAGENS_PARA_CHAMADO = 6

const CAMADAS_IDS = ['calor', 'luz', 'pavimento', 'ar']

// Atualiza a contagem de passagens críticas seguidas de cada ponto e camada.
// - anteriores: contagem da passagem passada, ex.: { '5-3': { luz: 2, calor: 0, ... }, ... }
// - leituras: valores da passagem nova (vindos da simulação)
// Se a leitura for crítica, soma 1. Qualquer outro resultado (inclusive "sem dados")
// quebra a sequência e volta para 0, porque já não é "o mesmo resultado".
export function atualizarSequencias(anteriores, leituras, pontos) {
  const novas = {}
  for (const ponto of pontos) {
    novas[ponto.id] = {}
    for (const camada of CAMADAS_IDS) {
      const estado = classificar(camada, leituras[ponto.id][camada])
      const antes = anteriores[ponto.id]?.[camada] || 0 // "?." evita erro se ainda não existir
      novas[ponto.id][camada] = estado === 'critico' ? antes + 1 : 0
    }
  }
  return novas
}

// Mesma conta, mas para UM ponto só (quando o ônibus para nele e lê o sensor).
// - anterior: contagem do ponto, ex.: { calor: 0, luz: 2, pavimento: 0, ar: 0 }
// - leitura: valores novos do ponto
export function atualizarSequenciaPonto(anterior, leitura) {
  const nova = {}
  for (const camada of CAMADAS_IDS) {
    const estado = classificar(camada, leitura[camada])
    nova[camada] = estado === 'critico' ? (anterior?.[camada] || 0) + 1 : 0
  }
  return nova
}

// Diz quais chamados automáticos precisam nascer agora.
// Só abre quando a contagem chega EXATAMENTE no limite (assim abre uma vez só)
// e se ainda não houver um chamado automático sem resolver para o mesmo ponto e tipo.
export function chamadosParaAbrir(pontos, chamados) {
  const lista = []
  for (const ponto of pontos) {
    for (const camada of CAMADAS_IDS) {
      if (ponto.sequencias[camada] !== PASSAGENS_PARA_CHAMADO) continue

      const jaExiste = chamados.some(
        (c) =>
          c.origem === 'automatico' &&
          c.pontoId === ponto.id &&
          c.tipo === camada &&
          c.status !== 'resolvido',
      )
      if (!jaExiste) lista.push({ ponto, camada })
    }
  }
  return lista
}

// Monta os dados do chamado automático (status e datas o useChamados completa).
// O local é o da ocorrência (ex.: "nº 1036 a 1056" num buraco), que vem pronto do useLeituras.
export function montarChamadoAutomatico(ponto, camada) {
  const local = ponto.locais[camada]
  return {
    tipo: camada,
    trechoId: ponto.ruaId, // na API o campo continua "trecho"; aqui ele guarda a rua
    trechoNome: ponto.ruaNome,
    pontoId: ponto.id,
    pontoNome: local.nome,
    lat: local.centro[0],
    lng: local.centro[1],
    prioridade: 'alta',
    origem: 'automatico',
    descricao: `Leitura crítica em ${PASSAGENS_PARA_CHAMADO} passagens seguidas.`,
    passagens: PASSAGENS_PARA_CHAMADO,
  }
}
