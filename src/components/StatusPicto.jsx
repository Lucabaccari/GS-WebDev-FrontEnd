// Pictograma do estado, desenhado em SVG (sem círculo atrás, como pede o guia).
// normal = visto | atenção = losango | crítico = octógono | sem dados = quadrado tracejado.
// A forma muda junto com a cor, então quem não enxerga cores também entende.
//
// aria-hidden: o texto do estado sempre aparece ao lado, então o leitor de tela
// não precisa ler o desenho de novo.

function StatusPicto({ estado, tamanho = 24 }) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="shrink-0"
    >
      {estado === 'normal' && (
        // Visto (✓) verde, traço grosso.
        <polyline
          points="4,12.5 9.5,18 20,6"
          fill="none"
          stroke="#17753F"
          strokeWidth="3.5"
          strokeLinecap="square"
        />
      )}

      {estado === 'atencao' && (
        <>
          {/* Losango amarelo com borda asfalto e "!" no meio */}
          <polygon points="12,1.5 22.5,12 12,22.5 1.5,12" fill="#FFC400" stroke="#1B1C1E" strokeWidth="2" />
          <rect x="11" y="6.5" width="2" height="7" fill="#1B1C1E" />
          <rect x="11" y="15.5" width="2" height="2" fill="#1B1C1E" />
        </>
      )}

      {estado === 'critico' && (
        <>
          {/* Octógono vermelho (forma de placa PARE) com barra branca */}
          <polygon
            points="7.5,1.5 16.5,1.5 22.5,7.5 22.5,16.5 16.5,22.5 7.5,22.5 1.5,16.5 1.5,7.5"
            fill="#D7261E"
            stroke="#1B1C1E"
            strokeWidth="2"
          />
          <rect x="6" y="10.5" width="12" height="3" fill="#FFFFFF" />
        </>
      )}

      {estado === 'sem_dados' && (
        // Quadrado tracejado com um traço: "não sabemos".
        <>
          <rect x="3" y="3" width="18" height="18" fill="none" stroke="#1B1C1E" strokeWidth="2" strokeDasharray="3 2" />
          <rect x="8" y="11" width="8" height="2" fill="#1B1C1E" />
        </>
      )}
    </svg>
  )
}

export default StatusPicto
