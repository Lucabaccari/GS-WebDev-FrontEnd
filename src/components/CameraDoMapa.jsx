// Controla para onde o mapa olha. Não desenha nada.
// - Visão "todas as ruas": enquadra as 6 ruas, mapa amplo.
// - Visão de uma rua: aproxima o zoom nela. Se "seguir" estiver ligado e o ônibus estiver
//   nessa rua, o mapa vai acompanhando o ônibus.
// - Se a pessoa arrastar o mapa, avisa (aoArrastar) para desligar o "seguir".
//
// Props: chaveVisao (muda quando a visão muda), limites, seguir, alvo ([lat, lng] do ônibus), aoArrastar.
import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'

const ZOOM_SEGUINDO = 16.5

function semMovimento() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function CameraDoMapa({ chaveVisao, limites, seguir, alvo, aoArrastar }) {
  const mapa = useMap()
  const lat = alvo?.[0]
  const lng = alvo?.[1]

  // Guarda o alvo e os limites mais recentes num useRef: o efeito de enquadrar lê esses
  // valores, mas só deve rodar quando a VISÃO muda (e não a cada passo do ônibus).
  const ultimo = useRef({ alvo, limites })
  useEffect(() => {
    ultimo.current = { alvo, limites }
  })

  // Quando a visão muda (outra rua, todas, ligou o seguir): enquadra ou aproxima.
  useEffect(() => {
    const animar = !semMovimento()
    const { alvo: posicao, limites: area } = ultimo.current
    if (seguir && posicao) mapa.setView(posicao, ZOOM_SEGUINDO, { animate: animar })
    else mapa.fitBounds(area, { padding: [32, 32], animate: animar })
  }, [mapa, chaveVisao, seguir])

  // Enquanto segue, a cada posição nova do ônibus o mapa desliza até ele.
  useEffect(() => {
    if (!seguir || lat === undefined) return
    mapa.panTo([lat, lng], { animate: !semMovimento(), duration: 0.2, easeLinearity: 1, noMoveStart: true })
  }, [mapa, seguir, lat, lng])

  // Arrastar o mapa com o mouse ou o dedo desliga o "seguir".
  useEffect(() => {
    if (!aoArrastar) return
    mapa.on('dragstart', aoArrastar)
    return () => mapa.off('dragstart', aoArrastar)
  }, [mapa, aoArrastar])

  return null
}

export default CameraDoMapa
