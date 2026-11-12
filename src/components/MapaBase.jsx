// Mapa de verdade, feito com a biblioteca Leaflet (via react-leaflet).
// - O fundo (ruas, quadras, nomes) vem do OpenStreetMap. No CSS ele fica em tons de cinza
//   para combinar com o concreto e deixar as cores dos estados em destaque.
// - Por cima, desenhamos as ruas recebidas em "ruas" (todas, ou só a rua escolhida).
// - "children" são as camadas extras: pontos de medição, ônibus, rastro, câmera ou chamados.
//
// Props:
// - ruas: quais ruas desenhar
// - aoSelecionarRua(id): opcional, clique numa rua
// - enquadrarSozinho: true = o próprio mapa enquadra as ruas ao abrir e ao mudar de tamanho.
//   Use false quando houver uma <CameraDoMapa> cuidando disso.
// - rotulo: texto para leitor de tela
import { Fragment } from 'react'
import { MapContainer, TileLayer, Polyline, Tooltip, ZoomControl } from 'react-leaflet'
import AjusteDoMapa from './AjusteDoMapa.jsx'
import { LIMITES_MAPA } from '../data/ruas.js'

const ATRIBUICAO = '&copy; <a href="https://www.openstreetmap.org/copyright">colaboradores do OpenStreetMap</a>'

function MapaBase({ ruas, aoSelecionarRua, enquadrarSozinho = true, children, rotulo }) {
  const umaRuaSo = ruas.length === 1 // com uma rua só, a linha fica mais grossa

  return (
    <div role="region" aria-label={rotulo} className="h-full w-full">
      <MapContainer
        bounds={LIMITES_MAPA} // enquadra as 6 ruas ao abrir
        boundsOptions={{ padding: [16, 16] }}
        zoomSnap={0.25} // permite zoom "quebrado" (13,5; 13,75...) para as ruas caberem melhor
        zoomDelta={0.5}
        minZoom={12}
        maxZoom={18}
        zoomControl={false} // o zoom vai para a direita (à esquerda ficam os botões de camada)
        scrollWheelZoom={false} // não "prende" a rolagem da página ao passar o mouse
        className="h-full w-full"
      >
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution={ATRIBUICAO} />
        <ZoomControl position="topright" zoomInTitle="Aproximar" zoomOutTitle="Afastar" />
        <AjusteDoMapa limites={enquadrarSozinho ? LIMITES_MAPA : null} />

        {ruas.map((rua) => (
          // Duas linhas por rua: uma branca larga por baixo (contorno) e a de asfalto por cima.
          // Fragment (<Fragment>) agrupa sem criar elemento extra na página.
          <Fragment key={rua.id}>
            <Polyline positions={rua.caminho} pathOptions={{ color: '#FFFFFF', weight: umaRuaSo ? 16 : 9, opacity: 1 }} />
            <Polyline
              positions={rua.caminho}
              pathOptions={{ color: '#1B1C1E', weight: umaRuaSo ? 9 : 4, opacity: umaRuaSo ? 1 : 0.8 }}
              eventHandlers={{ click: () => aoSelecionarRua?.(rua.id) }}
            >
              <Tooltip sticky>{rua.nome}</Tooltip>
            </Polyline>
          </Fragment>
        ))}

        {children}
      </MapContainer>
    </div>
  )
}

export default MapaBase
