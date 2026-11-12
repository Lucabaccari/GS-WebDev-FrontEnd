// Tela do Agente da subprefeitura: indicadores, mapa com os chamados no ponto exato
// do problema e a fila de atendimento (filtros, mudança de status e exclusão).
import { useState } from 'react'
import LetreiroLED from '../components/LetreiroLED.jsx'
import Indicadores from '../components/Indicadores.jsx'
import FiltrosChamados from '../components/FiltrosChamados.jsx'
import ListaChamados from '../components/ListaChamados.jsx'
import MapaBase from '../components/MapaBase.jsx'
import CamadaChamados from '../components/CamadaChamados.jsx'
import FocoNoMapa from '../components/FocoNoMapa.jsx'
import StatusPicto from '../components/StatusPicto.jsx'
import { RUAS } from '../data/ruas.js'
import { filtrarChamados, ordenarFila, FILTROS_VAZIOS } from '../utils/chamados.js'
import { calcularIndicadores } from '../utils/indicadores.js'

function Agente({ chamados, carregando, erro, aoRecarregar, aoMudarStatus, aoExcluir }) {
  const [filtros, setFiltros] = useState(FILTROS_VAZIOS)
  const [selecionadoId, setSelecionadoId] = useState(null) // chamado em destaque
  const [foco, setFoco] = useState(null) // [lat, lng] para onde o mapa deve ir

  // A fila mostra primeiro o que está sem resolver e com prioridade mais alta.
  const fila = ordenarFila(filtrarChamados(chamados, filtros))
  const indicadores = calcularIndicadores(chamados)
  const semResolver = indicadores.abertos + indicadores.emAtendimento

  // Clicou no marcador: destaca o bilhete e rola a fila até ele.
  function selecionarNoMapa(chamado) {
    setSelecionadoId(chamado.id)
    document.getElementById(`bilhete-${chamado.id}`)?.scrollIntoView({ block: 'nearest' })
  }

  // Clicou em "Ver no mapa" no bilhete: destaca e leva o mapa até o ponto.
  function verNoMapa(chamado) {
    setSelecionadoId(chamado.id)
    setFoco([Number(chamado.lat), Number(chamado.lng)])
  }

  return (
    <div className="space-y-5">
      <LetreiroLED mensagem={`${semResolver} chamado(s) sem resolver.`} info="Painel do agente" />

      <Indicadores dados={indicadores} />

      <div className="grid border-2 border-asfalto bg-white lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="flex flex-col">
          <div className="h-[50vh] min-h-[320px] lg:h-[680px]">
            <MapaBase ruas={RUAS} rotulo="Mapa dos chamados">
              <CamadaChamados chamados={fila} selecionadoId={selecionadoId} aoSelecionar={selecionarNoMapa} />
              <FocoNoMapa local={foco} />
            </MapaBase>
          </div>
          {/* Legenda do mapa do agente: a forma mostra o status */}
          <ul className="flex flex-wrap gap-x-5 gap-y-1 border-t-2 border-asfalto px-3 py-2 text-sm">
            <li className="flex items-center gap-1.5"><StatusPicto estado="critico" tamanho={16} /> Aberto</li>
            <li className="flex items-center gap-1.5"><StatusPicto estado="atencao" tamanho={16} /> Em atendimento</li>
            <li className="flex items-center gap-1.5"><StatusPicto estado="normal" tamanho={16} /> Resolvido</li>
          </ul>
        </div>

        <section
          aria-labelledby="titulo-fila"
          className="space-y-4 border-t-2 border-asfalto p-4 lg:h-[722px] lg:overflow-y-auto lg:border-t-0 lg:border-l-2"
        >
          <div className="flex items-baseline justify-between gap-2">
            <h2 id="titulo-fila" className="text-2xl font-black uppercase [font-stretch:75%]">Fila de atendimento</h2>
            <p className="text-sm font-semibold" role="status">{fila.length} de {chamados.length}</p>
          </div>

          <FiltrosChamados filtros={filtros} aoMudar={setFiltros} />

          <ListaChamados
            chamados={fila}
            carregando={carregando}
            erro={erro}
            aoTentarDeNovo={aoRecarregar}
            aoMudarStatus={aoMudarStatus}
            aoExcluir={aoExcluir}
            selecionadoId={selecionadoId}
            aoVerNoMapa={verNoMapa}
          />
        </section>
      </div>
    </div>
  )
}

export default Agente
