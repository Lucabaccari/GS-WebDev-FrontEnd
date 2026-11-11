// Fita colorida que marca o estado, como a faixa de uma linha de metrô.
// O PADRÃO muda junto com a cor: lisa (normal), listrada (atenção), diagonal (crítico).
// São padrões de listras, não gradientes de fundo.

const PADROES = {
  normal: '#17753F',
  atencao: 'repeating-linear-gradient(90deg, #FFC400 0 14px, #1B1C1E 14px 20px)',
  critico: 'repeating-linear-gradient(45deg, #D7261E 0 10px, #1B1C1E 10px 15px)',
  sem_dados: 'repeating-linear-gradient(90deg, #A9A59C 0 6px, transparent 6px 12px)',
}

function FitaEstado({ estado, altura = 10 }) {
  return (
    <div
      aria-hidden="true"
      className="w-full border-y-2 border-asfalto"
      style={{ height: altura, background: PADROES[estado] }}
    />
  )
}

export default FitaEstado
