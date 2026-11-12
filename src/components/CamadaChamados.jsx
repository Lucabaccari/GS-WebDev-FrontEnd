// Camada do mapa do Agente: cada chamado vira um marcador no ponto exato do problema.
// O desenho segue o status: aberto = octógono, em atendimento = losango, resolvido = visto.
// Chamados antigos sem latitude/longitude não aparecem no mapa (só na fila).
//
// Props: chamados, selecionadoId, aoSelecionar(chamado).
import { Marker, Tooltip } from 'react-leaflet'
import { iconeEstado } from '../utils/icones.js'
import { ROTULOS_STATUS, localDoChamado, rotuloTipo } from '../utils/chamados.js'
import { formatarProtocolo } from '../utils/formatadores.js'

// Qual pictograma representa cada status.
const PICTO_DO_STATUS = { aberto: 'critico', em_atendimento: 'atencao', resolvido: 'normal' }

function CamadaChamados({ chamados, selecionadoId, aoSelecionar }) {
  // Number.isFinite confere se lat e lng são números de verdade.
  const comLocal = chamados.filter((c) => Number.isFinite(Number(c.lat)) && Number.isFinite(Number(c.lng)) && c.lat !== '')

  return (
    <>
      {comLocal.map((chamado) => {
        const selecionado = chamado.id === selecionadoId
        const texto = `${formatarProtocolo(chamado.id)} · ${rotuloTipo(chamado.tipo)} · ${localDoChamado(chamado)} · ${ROTULOS_STATUS[chamado.status] || chamado.status}`
        return (
          <Marker
            // A key muda junto com o status: o marcador é recriado e o "title" fica certo.
            key={`${chamado.id}-${chamado.status}-${selecionado}`}
            position={[Number(chamado.lat), Number(chamado.lng)]}
            icon={iconeEstado(PICTO_DO_STATUS[chamado.status] || 'sem_dados', { selecionado })}
            title={texto}
            keyboard
            zIndexOffset={selecionado ? 1000 : chamado.status === 'aberto' ? 500 : 0}
            eventHandlers={{ click: () => aoSelecionar(chamado) }}
          >
            <Tooltip direction="top" offset={[0, -14]}>{texto}</Tooltip>
          </Marker>
        )
      })}
    </>
  )
}

export default CamadaChamados
