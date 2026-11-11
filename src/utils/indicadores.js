// Contas do painel do Agente. Função pura: recebe a lista de chamados e devolve números.

// Conta quantos itens da lista têm cada valor de um campo.
// Ex.: contarPor(chamados, 'status') -> { aberto: 3, resolvido: 1 }
function contarPor(lista, campo) {
  const contagem = {}
  for (const item of lista) {
    contagem[item[campo]] = (contagem[item[campo]] || 0) + 1
  }
  return contagem
}

export function calcularIndicadores(chamados) {
  const porStatus = contarPor(chamados, 'status')
  const porOrigem = contarPor(chamados, 'origem')

  // Tempo médio de resolução, em minutos, só dos chamados resolvidos com as duas datas.
  const tempos = chamados
    .filter((c) => c.status === 'resolvido' && c.criadoEm && c.resolvidoEm)
    .map((c) => (new Date(c.resolvidoEm) - new Date(c.criadoEm)) / 60000) // ms -> minutos
    .filter((min) => Number.isFinite(min) && min >= 0)

  const tempoMedioMin = tempos.length > 0 ? tempos.reduce((soma, t) => soma + t, 0) / tempos.length : null

  return {
    total: chamados.length,
    abertos: porStatus.aberto || 0,
    emAtendimento: porStatus.em_atendimento || 0,
    resolvidos: porStatus.resolvido || 0,
    automaticos: porOrigem.automatico || 0,
    doCidadao: porOrigem.cidadao || 0,
    porTipo: contarPor(chamados, 'tipo'),
    tempoMedioMin, // null quando ainda não há chamado resolvido
  }
}
