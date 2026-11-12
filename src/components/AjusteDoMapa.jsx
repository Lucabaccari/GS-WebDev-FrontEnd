// O Leaflet mede o tamanho do mapa só quando ele aparece. Se a caixa do mapa muda de
// tamanho depois (layout terminando de montar, celular girando, visão "todas" mais alta),
// ele fica desenquadrado. Este componente "observa" a caixa e, quando o tamanho muda,
// manda o mapa medir de novo. Se receber "limites", também enquadra essas ruas
// (até a pessoa arrastar o mapa). Não desenha nada.
// Props: limites ([[lat, lng], [lat, lng]]) ou null para só medir de novo.
import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

function AjusteDoMapa({ limites }) {
  const mapa = useMap()

  useEffect(() => {
    let pessoaMexeu = false
    function marcarQueMexeu() {
      pessoaMexeu = true
    }
    mapa.on('dragstart', marcarQueMexeu)

    // ResizeObserver avisa sempre que o tamanho de um elemento muda.
    const observador = new ResizeObserver(() => {
      mapa.invalidateSize() // "mede de novo"
      if (limites && !pessoaMexeu) mapa.fitBounds(limites, { padding: [16, 16], animate: false })
    })
    observador.observe(mapa.getContainer())

    // Limpeza ao sair da tela.
    return () => {
      observador.disconnect()
      mapa.off('dragstart', marcarQueMexeu)
    }
  }, [mapa, limites])

  return null
}

export default AjusteDoMapa
