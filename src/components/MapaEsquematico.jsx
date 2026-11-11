// Mapa esquemático da linha em SVG, no estilo da faixa do metrô:
// uma linha vertical dividida em 6 trechos, de cima para baixo.
// Cada trecho tem cor + padrão (lisa, listrada, diagonal) + pictograma + texto.
import StatusPicto from './StatusPicto.jsx'
import { ROTULOS_ESTADO, estadoDoTrecho } from '../utils/classificar.js'

const ALTURA_TRECHO = 64 // altura de cada trecho no desenho
const TOPO = 12 // espaço antes do primeiro trecho

// Preenchimento da faixa de cada estado. "url(#...)" usa os padrões definidos no <defs>.
const PREENCHIMENTO = {
  normal: '#17753F',
  atencao: 'url(#padrao-atencao)',
  critico: 'url(#padrao-critico)',
  sem_dados: 'url(#padrao-sem-dados)',
}

function MapaEsquematico({ trechos, camada }) {
  const altura = TOPO * 2 + trechos.length * ALTURA_TRECHO

  // Resumo em texto para leitor de tela, ex.: "1 Av. Paulista: Atenção. 2 R. Augusta: Normal. ..."
  const resumo = trechos
    .map((t) => `${t.id} ${t.nome}: ${ROTULOS_ESTADO[estadoDoTrecho(t, camada)]}`)
    .join('. ')

  return (
    <svg viewBox={`0 0 320 ${altura}`} className="w-full" role="img" aria-label={`Mapa da linha. ${resumo}.`}>
      <defs>
        {/* Listras horizontais amarelas e pretas (atenção) */}
        <pattern id="padrao-atencao" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="#FFC400" />
          <rect y="7" width="10" height="3" fill="#1B1C1E" />
        </pattern>
        {/* Listras diagonais vermelhas e pretas (crítico) */}
        <pattern id="padrao-critico" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="10" height="10" fill="#D7261E" />
          <rect x="7" width="3" height="10" fill="#1B1C1E" />
        </pattern>
        {/* Tracejado cinza (sem dados) */}
        <pattern id="padrao-sem-dados" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#E9E6DF" />
          <rect width="8" height="4" fill="#A9A59C" />
        </pattern>
      </defs>

      {trechos.map((trecho, i) => {
        const estado = estadoDoTrecho(trecho, camada)
        const y = TOPO + i * ALTURA_TRECHO // topo deste trecho
        const meio = y + ALTURA_TRECHO / 2

        return (
          <g key={trecho.id}>
            {/* Pedaço da faixa da linha */}
            <rect x="22" y={y} width="18" height={ALTURA_TRECHO} fill={PREENCHIMENTO[estado]} stroke="#1B1C1E" strokeWidth="2" />

            {/* Parada: quadrado branco com o número do trecho */}
            <rect x="15" y={meio - 16} width="32" height="32" fill="#FFFFFF" stroke="#1B1C1E" strokeWidth="3" />
            <text x="31" y={meio + 6} textAnchor="middle" fontSize="17" fontWeight="900" fill="#1B1C1E">
              {trecho.id}
            </text>

            {/* Pictograma do estado (SVG dentro do SVG, posicionado com x e y) */}
            <svg x="58" y={meio - 14} width="28" height="28" overflow="visible">
              <StatusPicto estado={estado} tamanho={28} />
            </svg>

            {/* Nome do trecho e estado por extenso */}
            <text x="96" y={meio - 3} fontSize="16" fontWeight="800" fill="#1B1C1E" style={{ textTransform: 'uppercase', fontStretch: '75%' }}>
              {trecho.nome}
            </text>
            <text x="96" y={meio + 15} fontSize="13" fontWeight="600" fill="#1B1C1E">
              {ROTULOS_ESTADO[estado]}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default MapaEsquematico
