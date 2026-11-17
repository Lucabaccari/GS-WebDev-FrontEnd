// Mapa pequeno de UM chamado: mostra a rua do chamado e o ponto onde o problema foi reportado.
// Aparece quando o agente abre um chamado da fila.
// Props: chamado (o objeto vindo da API).
import MapaBase from './MapaBase.jsx'
import CamadaChamados from './CamadaChamados.jsx'
import FocoNoMapa from './FocoNoMapa.jsx'
import { RUAS } from '../data/ruas.js'

function MapaDoChamado({ chamado }) {
  const lat = Number(chamado.lat)
  const lng = Number(chamado.lng)
  // Chamados antigos podem não ter o local guardado: avisa em vez de mostrar um mapa vazio.
  if (chamado.lat === '' || chamado.lat === undefined || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return (
      <p className="flex h-full min-h-40 items-center justify-center rounded-lg border border-dashed border-agente-linha p-4 text-sm text-tinta-2">
        Este chamado não tem o local no mapa.
      </p>
    )
  }

  // Só a rua do chamado aparece (as outras ficariam como ruído num mapa pequeno).
  const rua = RUAS.find((r) => r.id === Number(chamado.trechoId))

  return (
    <div className="h-56 overflow-hidden rounded-lg border border-agente-linha md:h-full md:min-h-56">
      <MapaBase ruas={rua ? [rua] : []} enquadrarSozinho={false} rotulo={`Mapa do local do chamado: ${chamado.trechoNome}`}>
        {/* O mesmo marcador do status (octógono, losango ou visto), em tamanho menor, como o mapa */}
        <CamadaChamados chamados={[chamado]} selecionadoId={chamado.id} aoSelecionar={() => {}} compacto />
        {/* Centraliza no ponto do problema, direto (sem animação), com zoom que mostra as quadras em volta */}
        <FocoNoMapa local={[lat, lng]} zoom={16} animar={false} />
      </MapaBase>
    </div>
  )
}

export default MapaDoChamado
