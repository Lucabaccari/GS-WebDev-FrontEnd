// Move o mapa até um local quando ele muda (ex.: o ponto de um chamado).
// Não desenha nada: só usa o mapa do Leaflet pelo hook useMap do react-leaflet.
// Props: local ([lat, lng] ou null), zoom (quanto aproximar; padrão 17) e
// animar (true = o mapa "voa" até o ponto; false = vai direto).
import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

function FocoNoMapa({ local, zoom = 17, animar = true }) {
  const mapa = useMap()
  const lat = local?.[0]
  const lng = local?.[1]

  useEffect(() => {
    if (lat === undefined || lng === undefined) return
    // flyTo faz o mapa "voar" até o ponto; sem animação (ou para quem pediu menos movimento), vai direto.
    const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (animar && !semMovimento) {
      mapa.flyTo([lat, lng], zoom, { duration: 0.8 })
      return
    }
    function centralizar() {
      mapa.setView([lat, lng], zoom, { animate: false })
    }
    centralizar()
    // O mapa pode mudar de tamanho logo depois de aparecer (o layout ainda está montando):
    // quando isso acontece, centraliza de novo para o ponto continuar no meio.
    mapa.on('resize', centralizar)
    return () => mapa.off('resize', centralizar)
  }, [mapa, lat, lng, zoom, animar])

  return null
}

export default FocoNoMapa
