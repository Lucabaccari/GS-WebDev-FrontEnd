// Placas das paradas de ônibus (simuladas) na rua em foco. É onde o ônibus para por alguns segundos.
// Props: trajeto (de utils/rota.js).
import { Marker } from 'react-leaflet'
import { posicaoNoCaminho } from '../utils/geo.js'
import { ICONE_PARADA } from '../utils/icones.js'

function CamadaParadas({ trajeto }) {
  return (
    <>
      {trajeto.paradas.map((fracao, i) => (
        <Marker
          key={i}
          position={posicaoNoCaminho(trajeto.caminho, fracao)}
          icon={ICONE_PARADA}
          title={`Parada de ônibus ${i + 1}`}
          interactive={false}
        />
      ))}
    </>
  )
}

export default CamadaParadas
