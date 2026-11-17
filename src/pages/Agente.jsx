// Tela do Agente da subprefeitura: indicadores e a fila de atendimento.
// A fila mostra os chamados em linhas, um embaixo do outro, com filtros.
// Clicar num chamado abre o detalhe com um mapa pequeno do ponto do problema,
// a mudança de status e a exclusão.
// Na primeira visita, abre um tour guiado de 5 passos (pode pular; "Como usar" abre de novo).
// Cores: azul institucional (tokens "agente" no index.css), diferente da tela do cidadão.
import { useState } from 'react'
import Indicadores from '../components/Indicadores.jsx'
import FiltrosChamados from '../components/FiltrosChamados.jsx'
import ListaChamados from '../components/ListaChamados.jsx'
import TourGuiado from '../components/TourGuiado.jsx'
import BotaoComoUsar from '../components/BotaoComoUsar.jsx'
import { useTour } from '../hooks/useTour.js'
import { PASSOS_TOUR_AGENTE } from '../data/tour.js'
import { filtrarChamados, ordenarFila, FILTROS_VAZIOS } from '../utils/chamados.js'
import { calcularIndicadores } from '../utils/indicadores.js'

function Agente({ chamados, carregando, erro, aoRecarregar, aoMudarStatus, aoExcluir }) {
  const [filtros, setFiltros] = useState(FILTROS_VAZIOS)
  const [abertoId, setAbertoId] = useState(null) // chamado com o detalhe aberto, ou null

  // A fila mostra os chamados mais recentes primeiro.
  const fila = ordenarFila(filtrarChamados(chamados, filtros))
  const indicadores = calcularIndicadores(chamados)

  // Tour: no passo "Abra um chamado", abre o primeiro da fila; nos outros, fecha.
  const tour = useTour('pulso-tour-agente', PASSOS_TOUR_AGENTE.length, (numero) => {
    setAbertoId(PASSOS_TOUR_AGENTE[numero].abrirChamado && fila.length > 0 ? fila[0].id : null)
  })

  // Clicar no chamado aberto fecha; clicar em outro abre o outro (um aberto por vez).
  function alternar(id) {
    setAbertoId(id === abertoId ? null : id)
  }

  return (
    <div className="space-y-6">
      {/* data-tour: marca os elementos que o tour destaca */}
      <div data-tour="indicadores">
        <Indicadores dados={indicadores} acao={<BotaoComoUsar aoClicar={tour.abrir} />} />
      </div>

      <section aria-labelledby="titulo-fila" className="space-y-4">
        <div className="flex items-baseline justify-between gap-2">
          <h2 id="titulo-fila" className="text-2xl font-semibold tracking-tight">
            Fila de atendimento
          </h2>
          <p className="text-sm font-semibold text-agente" role="status">
            {fila.length} de {chamados.length} chamados
          </p>
        </div>

        <div data-tour="filtros">
          <FiltrosChamados filtros={filtros} aoMudar={setFiltros} />
        </div>

        <div data-tour="fila">
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
        </div>
      </section>

      {tour.aberto && (
        <TourGuiado
          passos={PASSOS_TOUR_AGENTE}
          passo={tour.passo}
          aoAvancar={tour.avancar}
          aoVoltar={tour.voltar}
          aoFechar={tour.fechar}
        />
      )}
    </div>
  )
}

export default Agente
