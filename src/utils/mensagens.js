// Textos curtos para o cidadão, com o verbo no começo (regra do guia de estilo).
// Função pura: recebe os trechos e devolve a frase do letreiro.

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
    critico: 'Ar poluído. Evite esforço neste trecho.',
    atencao: 'Ar carregado. Pegue leve.',
  },
}

// Peso de cada estado: quanto maior, mais urgente.
const PESO = { critico: 2, atencao: 1 }

// Procura o alerta mais urgente da linha.
// camada: 'geral' (olha as 4 camadas) ou uma camada só ('calor', 'luz'...).
// Devolve { trecho, camada, estado } ou null se está tudo normal.
export function alertaMaisUrgente(trechos, camada = 'geral') {
  const camadasParaOlhar = camada === 'geral' ? ['calor', 'luz', 'pavimento', 'ar'] : [camada]
  let melhor = null

  for (const trecho of trechos) {
    for (const c of camadasParaOlhar) {
      const estado = trecho.estados[c]
      const peso = PESO[estado] || 0 // normal e sem dados valem 0
      if (peso > 0 && (!melhor || peso > PESO[melhor.estado])) {
        melhor = { trecho, camada: c, estado }
      }
    }
  }
  return melhor
}

// Monta a frase do letreiro. Ex.: "R. Oscar Freire: Trecho escuro. Prefira outro caminho agora."
export function mensagemLetreiro(trechos, camada = 'geral') {
  const alerta = alertaMaisUrgente(trechos, camada)
  if (!alerta) return 'Linha sem alertas. Boa viagem.'
  return `${alerta.trecho.nome}: ${FRASES[alerta.camada][alerta.estado]}`
}
