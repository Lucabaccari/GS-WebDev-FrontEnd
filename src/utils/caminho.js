// "Verifique seu caminho" (plano B). Funções puras: só fazem contas.
//
// Na vida real, o app pegaria a origem e o destino da pessoa e calcularia o caminho sozinho.
// Aqui não temos esse cálculo, então a própria pessoa monta o caminho: escolhe uma ou mais ruas
// e, em cada uma, de qual número até qual número vai passar. O app confere se há alerta
// (atenção ou crítico) nos pontos de medição desses trechos, com as leituras de agora.

const CAMADAS_IDS = ['calor', 'luz', 'pavimento', 'ar']
const PESO = { normal: 0, atencao: 1, critico: 2 }

// Um trecho do caminho: { ruaId, deM, ateM } (metros desde o começo da rua = numeração simulada).
// Devolve os pontos da rua que o trecho cobre (o trecho de 100 m de cada ponto encosta no intervalo).
export function pontosDoTrecho(rua, deM, ateM) {
  const inicio = Math.min(deM, ateM)
  const fim = Math.max(deM, ateM) // a pessoa pode escolher "do 900 ao 300" (sentido contrário)
  return rua.pontos.filter((p) => p.inicioM < fim && p.fimM > inicio)
}

// Confere o caminho inteiro.
// - trechos: [{ ruaId, deM, ateM }]
// - ruas: as ruas com os pontos e os estados atuais (vêm do useLeituras)
// - camada: 'geral' (as 4 camadas) ou uma camada só
// Devolve { pior: 'normal' | 'atencao' | 'critico', alertas: [...], porTrecho: [...] }
export function verificarCaminho(trechos, ruas, camada = 'geral') {
  const camadas = camada === 'geral' ? CAMADAS_IDS : [camada]
  const alertas = []
  const porTrecho = []

  for (const trecho of trechos) {
    const rua = ruas.find((r) => r.id === trecho.ruaId)
    if (!rua) continue
    const doTrecho = []
    for (const ponto of pontosDoTrecho(rua, trecho.deM, trecho.ateM)) {
      for (const c of camadas) {
        const estado = ponto.estados[c]
        if (estado === 'atencao' || estado === 'critico') {
          doTrecho.push({ id: `${ponto.id}-${c}`, ponto, camada: c, estado, ruaNome: rua.nome, local: ponto.locais[c].nome })
        }
      }
    }
    // Crítico primeiro, depois atenção.
    doTrecho.sort((a, b) => PESO[b.estado] - PESO[a.estado])
    porTrecho.push({ ruaId: rua.id, ruaNome: rua.nome, alertas: doTrecho })
    alertas.push(...doTrecho)
  }

  const pior = alertas.reduce((maior, a) => (PESO[a.estado] > PESO[maior] ? a.estado : maior), 'normal')
  return { pior, alertas, porTrecho }
}

// Frase curta do resultado, com o verbo no começo (regra do guia de estilo).
export function conselhoDoCaminho(resultado) {
  if (resultado.pior === 'critico') return 'Evite este caminho agora. Há trecho crítico no percurso.'
  if (resultado.pior === 'atencao') return 'Siga com cuidado. Há trechos em atenção no percurso.'
  return 'Pode seguir. Nenhum alerta no seu caminho agora.'
}
