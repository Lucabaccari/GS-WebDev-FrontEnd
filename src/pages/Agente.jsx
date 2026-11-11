// Tela do Agente da subprefeitura: lista de chamados com filtros, mudança de status e exclusão.
// Os indicadores e o chamado automático chegam no commit 8.
import { useState } from 'react'
import LetreiroLED from '../components/LetreiroLED.jsx'
import FiltrosChamados from '../components/FiltrosChamados.jsx'
import ListaChamados from '../components/ListaChamados.jsx'
import { filtrarChamados, FILTROS_VAZIOS } from '../utils/chamados.js'

function Agente({ chamados, carregando, erro, aoRecarregar, aoMudarStatus, aoExcluir }) {
  const [filtros, setFiltros] = useState(FILTROS_VAZIOS)

  const visiveis = filtrarChamados(chamados, filtros)
  const abertos = chamados.filter((c) => c.status !== 'resolvido').length

  return (
    <div className="space-y-6">
      <LetreiroLED titulo="Painel do agente" mensagem={`${abertos} chamado(s) sem resolver.`} />

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
