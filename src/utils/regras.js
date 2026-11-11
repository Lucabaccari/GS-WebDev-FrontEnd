// Regra do chamado automático. Funções puras: só fazem contas, não chamam a API.
//
// Regra: quando o mesmo trecho dá resultado CRÍTICO na mesma camada por
// PASSAGENS_PARA_CHAMADO passagens seguidas, o sistema abre um chamado sozinho.
// (O PDF do Pulso falava em 3; o grupo decidiu usar 6.)
import { classificar } from './classificar.js'

export const PASSAGENS_PARA_CHAMADO = 6

const CAMADAS_IDS = ['calor', 'luz', 'pavimento', 'ar']

// Atualiza a contagem de passagens críticas seguidas de cada trecho e camada.
// - anteriores: contagem da passagem passada, ex.: { 5: { luz: 2, calor: 0, ... }, ... }
// - leituras: valores da passagem nova (vindos da simulação)
// Se a leitura for crítica, soma 1. Qualquer outro resultado (inclusive "sem dados")
// quebra a sequência e volta para 0, porque já não é "o mesmo resultado".
export function atualizarSequencias(anteriores, leituras, trechos) {
  const novas = {}
  for (const trecho of trechos) {
    novas[trecho.id] = {}
    for (const camada of CAMADAS_IDS) {
      const estado = classificar(camada, leituras[trecho.id][camada])
      const antes = anteriores[trecho.id]?.[camada] || 0 // "?." evita erro se ainda não existir
      novas[trecho.id][camada] = estado === 'critico' ? antes + 1 : 0
    }
  }
  return novas
}

// Diz quais chamados automáticos precisam nascer agora.
// Só abre quando a contagem chega EXATAMENTE em 6 (assim abre uma vez só)
// e se ainda não houver um chamado automático sem resolver para o mesmo trecho e tipo.
export function chamadosParaAbrir(trechos, chamados) {
  const lista = []
  for (const trecho of trechos) {
    for (const camada of CAMADAS_IDS) {
      if (trecho.sequencias[camada] !== PASSAGENS_PARA_CHAMADO) continue

      const jaExiste = chamados.some(
        (c) =>
          c.origem === 'automatico' &&
          Number(c.trechoId) === trecho.id &&
          c.tipo === camada &&
          c.status !== 'resolvido',
      )
      if (!jaExiste) lista.push({ trecho, camada })
    }
  }
  return lista
}

// Monta os dados do chamado automático (status e datas o useChamados completa).
export function montarChamadoAutomatico(trecho, camada) {
  return {
    tipo: camada,
    trechoId: trecho.id,
    trechoNome: trecho.nome,
    prioridade: 'alta',
    origem: 'automatico',
    descricao: `Leitura crítica em ${PASSAGENS_PARA_CHAMADO} passagens seguidas.`,
    passagens: PASSAGENS_PARA_CHAMADO,
  }
}
