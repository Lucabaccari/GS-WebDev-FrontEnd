// Rastro do ônibus: o pedaço da rua que ele já percorreu nesta passagem fica marcado
// com uma linha âmbar tracejada, como um "escaneamento" da rua.
// Na ida o rastro vai do começo até o ônibus; na volta, do fim até o ônibus.
// Props: caminho (traçado da rua) e rastro ([de, ate], frações da rua de 0 a 1).
import { Polyline } from 'react-leaflet'
import { trechoDoCaminho } from '../utils/geo.js'

function CamadaRastro({ caminho, rastro }) {
  const [de, ate] = rastro
  if (ate - de <= 0.001) return null
  return (
    <Polyline
      positions={trechoDoCaminho(caminho, de, ate)}
      pathOptions={{ color: '#FFB000', weight: 3, dashArray: '2 6', opacity: 1, interactive: false }}
    />
  )
}

export default CamadaRastro
