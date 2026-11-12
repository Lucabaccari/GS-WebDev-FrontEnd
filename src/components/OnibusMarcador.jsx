// Um ônibus com sensor no mapa. A posição e a direção vêm prontas do hook useOnibus.
// Se receber "texto", mostra um balão sempre aberto ao lado (usado na rua em foco).
//
// Props: posicao ([lat, lng]), rumo (graus), parado (true na parada de ônibus), texto (opcional),
// titulo (nome acessível, ex.: "Ônibus da Av. Paulista"), pequeno (versão menor para o mapa amplo).
import { Marker, Tooltip } from 'react-leaflet'
import { iconeOnibus } from '../utils/icones.js'

function OnibusMarcador({ posicao, rumo, parado, texto, titulo, pequeno = false }) {
  return (
    // O sensor mede o tempo todo; a caixa do teto pisca enquanto o ônibus anda medindo.
    <Marker position={posicao} icon={iconeOnibus(rumo, !parado, pequeno)} title={titulo} interactive={false} zIndexOffset={2000}>
      {texto && (
        // permanent: o balão fica sempre aberto, acompanhando o ônibus
        <Tooltip permanent direction="right" offset={[18, 0]} className="balao-onibus">
          {texto}
        </Tooltip>
      )}
    </Marker>
  )
}

export default OnibusMarcador
