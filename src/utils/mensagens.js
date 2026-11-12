// Textos curtos para o cidadão, com o verbo no começo (regra do guia de estilo).
// Função pura: recebe os pontos e devolve a frase do letreiro.

// Uma frase para cada camada em atenção ou crítico.
const FRASES = {
  calor: {
    critico: 'Calor forte. Procure sombra e água.',
    atencao: 'Calor subindo. Leve água.',
  },
  luz: {
    critico: 'Trecho escuro. Prefira outro caminho agora.',
    atencao: 'Pouca luz. Ande por vias movimentadas.',
  },
  pavimento: {
    critico: 'Buraco na via. Cuidado ao descer do ônibus.',
    atencao: 'Piso irregular. Olhe onde pisa.',
  },
  ar: {
    critico: 'Ar poluído. Evite esforço neste ponto.',
    atencao: 'Ar carregado. Pegue leve.',
  },
}

// Peso de cada estado: quanto maior, mais urgente.
const PESO = { critico: 2, atencao: 1 }

// Procura o alerta mais urgente entre os pontos.
// camada: 'geral' (olha as 4 camadas) ou uma camada só ('calor', 'luz'...).
// Devolve { ponto, camada, estado } ou null se está tudo normal.
export function alertaMaisUrgente(pontos, camada = 'geral') {
  const camadasParaOlhar = camada === 'geral' ? ['calor', 'luz', 'pavimento', 'ar'] : [camada]
  let melhor = null

  for (const ponto of pontos) {
    for (const c of camadasParaOlhar) {
      const estado = ponto.estados[c]
      const peso = PESO[estado] || 0 // normal e sem dados valem 0
      if (peso > 0 && (!melhor || peso > PESO[melhor.estado])) {
        melhor = { ponto, camada: c, estado }
      }
    }
  }
  return melhor
}

// Frase de um alerta. Ex.: "R. Oscar Freire, nº 1036 a 1056: Trecho escuro. Prefira outro caminho agora."
export function fraseDoAlerta(alerta) {
  // O local é o da ocorrência: 20 números para luz e pavimento, o trecho de 100 m para calor e ar.
  const local = alerta.ponto.locais[alerta.camada].nome
  return `${alerta.ponto.ruaNome}, ${local}: ${FRASES[alerta.camada][alerta.estado]}`
}

// Monta a frase do letreiro a partir do alerta mais urgente.
export function mensagemLetreiro(pontos, camada = 'geral') {
  const alerta = alertaMaisUrgente(pontos, camada)
  if (!alerta) return 'Ruas sem alertas. Boa viagem.'
  return fraseDoAlerta(alerta)
}
