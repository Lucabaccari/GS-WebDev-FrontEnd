// Move o mapa até um local quando ele muda (ex.: "Ver no mapa" num chamado).
// Não desenha nada: só usa o mapa do Leaflet pelo hook useMap do react-leaflet.
// Props: local ([lat, lng] ou null).
import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

function FocoNoMapa({ local }) {
  const mapa = useMap()
  const lat = local?.[0]
  const lng = local?.[1]

  useEffect(() => {
    if (lat === undefined || lng === undefined) return
    // flyTo faz o mapa "voar" até o ponto; quem pediu menos movimento vai direto (setView).
    const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (semMovimento) mapa.setView([lat, lng], 17)
    else mapa.flyTo([lat, lng], 17, { duration: 0.8 })
  }, [mapa, lat, lng])

  return null
}

export default FocoNoMapa
