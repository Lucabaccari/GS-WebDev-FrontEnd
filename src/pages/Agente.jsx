// Tela do Agente da subprefeitura: indicadores e lista de chamados com filtros,
// mudança de status e exclusão.
import { useState } from 'react'
import LetreiroLED from '../components/LetreiroLED.jsx'
import Indicadores from '../components/Indicadores.jsx'
import FiltrosChamados from '../components/FiltrosChamados.jsx'
import ListaChamados from '../components/ListaChamados.jsx'
import { filtrarChamados, FILTROS_VAZIOS } from '../utils/chamados.js'
import { calcularIndicadores } from '../utils/indicadores.js'

function Agente({ chamados, carregando, erro, aoRecarregar, aoMudarStatus, aoExcluir }) {
  const [filtros, setFiltros] = useState(FILTROS_VAZIOS)

  const visiveis = filtrarChamados(chamados, filtros)
  const indicadores = calcularIndicadores(chamados)
  const semResolver = indicadores.abertos + indicadores.emAtendimento

  return (
    <div className="space-y-6">
      <LetreiroLED titulo="Painel do agente" mensagem={`${semResolver} chamado(s) sem resolver.`} />

      <Indicadores dados={indicadores} />

      <h2 className="text-2xl font-black uppercase [font-stretch:75%]">Chamados</h2>

      <FiltrosChamados filtros={filtros} aoMudar={setFiltros} />

      <p className="text-sm font-semibold" role="status">
        Mostrando {visiveis.length} de {chamados.length} chamado(s).
      </p>

      <ListaChamados
        chamados={visiveis}
        carregando={carregando}
        erro={erro}
        aoTentarDeNovo={aoRecarregar}
        aoMudarStatus={aoMudarStatus}
        aoExcluir={aoExcluir}
      />
    </div>
  )
}

export default Agente
