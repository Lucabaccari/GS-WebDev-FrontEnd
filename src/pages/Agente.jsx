// Tela do Agente da subprefeitura: indicadores e a fila de atendimento.
// A fila mostra os chamados em linhas, um embaixo do outro, com filtros.
// Clicar num chamado abre o detalhe com um mapa pequeno do ponto do problema,
// a mudança de status e a exclusão.
// Cores: azul institucional (tokens "agente" no index.css), diferente da tela do cidadão.
import { useState } from 'react'
import Indicadores from '../components/Indicadores.jsx'
import FiltrosChamados from '../components/FiltrosChamados.jsx'
import ListaChamados from '../components/ListaChamados.jsx'
import { filtrarChamados, ordenarFila, FILTROS_VAZIOS } from '../utils/chamados.js'
import { calcularIndicadores } from '../utils/indicadores.js'

function Agente({ chamados, carregando, erro, aoRecarregar, aoMudarStatus, aoExcluir }) {
  const [filtros, setFiltros] = useState(FILTROS_VAZIOS)
  const [abertoId, setAbertoId] = useState(null) // chamado com o detalhe aberto, ou null

  // A fila mostra os chamados mais recentes primeiro.
  const fila = ordenarFila(filtrarChamados(chamados, filtros))
  const indicadores = calcularIndicadores(chamados)

  // Clicar no chamado aberto fecha; clicar em outro abre o outro (um aberto por vez).
  function alternar(id) {
    setAbertoId(id === abertoId ? null : id)
  }

  return (
    <div className="space-y-6">
      <Indicadores dados={indicadores} />

      <section aria-labelledby="titulo-fila" className="space-y-4">
        <div className="flex items-baseline justify-between gap-2">
          <h2 id="titulo-fila" className="text-2xl font-semibold tracking-tight">
            Fila de atendimento
          </h2>
          <p className="text-sm font-semibold text-agente" role="status">
            {fila.length} de {chamados.length} chamados
          </p>
        </div>

        <FiltrosChamados filtros={filtros} aoMudar={setFiltros} />

        <ListaChamados
          chamados={fila}
          carregando={carregando}
          erro={erro}
          aoTentarDeNovo={aoRecarregar}
          aoMudarStatus={aoMudarStatus}
          aoExcluir={aoExcluir}
          abertoId={abertoId}
          aoAbrir={alternar}
        />
      </section>
    </div>
  )
}

export default Agente
