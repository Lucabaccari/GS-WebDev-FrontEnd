// Um chamado da fila do Agente, desenhado como bilhete DEITADO (uma linha):
// canhoto com o ícone do problema | picote | protocolo, tipo, local e descrição | prioridade | carimbo do status.
// Clicar na linha abre o detalhe: o mapa pequeno com o ponto do problema, os dados e as ações.
//
// Props:
// - chamado: o objeto vindo da API
// - aberto: true quando o detalhe está aberto
// - aoAbrir(): abre ou fecha o detalhe
// - aoMudarStatus(chamado, status) e aoExcluir(id): ações do agente
import { useState } from 'react'
import IconeProblema from './IconeProblema.jsx'
import MapaDoChamado from './MapaDoChamado.jsx'
import { ROTULOS_STATUS, ROTULOS_PRIORIDADE, ROTULOS_ORIGEM, rotuloTipo, localDoChamado } from '../utils/chamados.js'
import { formatarProtocolo, formatarDataHora } from '../utils/formatadores.js'

// Cor do carimbo de cada status (o texto também muda, então não depende só da cor).
const CORES_CARIMBO = {
  aberto: 'border-critico/60 text-[#A3160F] bg-critico/5',
  em_atendimento: 'border-[#B58800] text-tinta bg-atencao/25',
  resolvido: 'border-normal/60 text-normal bg-normal/5',
}

// Setinha que gira quando o detalhe abre.
function Seta({ aberto }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className={`shrink-0 transition-transform ${aberto ? 'rotate-180' : ''}`}>
      <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BilheteChamado({ chamado, aberto = false, aoAbrir, aoMudarStatus, aoExcluir }) {
  // true enquanto o bilhete pergunta "Excluir mesmo?"
  const [confirmando, setConfirmando] = useState(false)
  const idDetalhe = `detalhe-${chamado.id}`

  return (
    // data-tour: quando aberto, o tour do Agente destaca este bilhete ("Abra um chamado")
    <article
      data-tour={aberto ? 'chamado-aberto' : undefined}
      className={`overflow-hidden rounded-xl border bg-white transition-shadow ${
        aberto ? 'border-agente shadow-suave ring-2 ring-agente/25' : 'border-agente-linha hover:border-agente'
      }`}
    >
      {/* A linha inteira é um botão: abre e fecha o detalhe (aria-expanded avisa o leitor de tela) */}
      <button
        type="button"
        aria-expanded={aberto}
        aria-controls={idDetalhe}
        onClick={aoAbrir}
        className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center text-left md:grid-cols-[auto_minmax(0,1fr)_9rem_12rem]"
      >
        {/* Canhoto do bilhete: o ícone do tipo do problema, separado pelo picote (linha tracejada) */}
        <span className="flex h-full items-center border-r border-dashed border-agente-linha bg-agente-fundo px-3 py-3">
          <IconeProblema tipo={chamado.tipo} tamanho={40} />
        </span>

        <span className="min-w-0 px-4 py-3">
          <span className="block font-mono text-[11px] tracking-wider text-tinta-2 uppercase">
            {formatarProtocolo(chamado.id)} · {formatarDataHora(chamado.criadoEm)}
          </span>
          <span className="mt-0.5 block leading-tight font-semibold tracking-tight">
            {rotuloTipo(chamado.tipo)} · {localDoChamado(chamado)}
          </span>
          <span className="mt-0.5 block truncate text-sm text-tinta-2">{chamado.descricao}</span>
        </span>

        {/* Prioridade e origem (no celular, ficam só no detalhe) */}
        <span className="hidden text-sm md:block">
          <span className="block">
            Prioridade <strong className="font-semibold">{ROTULOS_PRIORIDADE[chamado.prioridade] || chamado.prioridade}</strong>
          </span>
          <span className="block text-tinta-2">{ROTULOS_ORIGEM[chamado.origem] || chamado.origem}</span>
        </span>

        {/* Coluna de largura fixa (no computador): o carimbo muda de tamanho com o status, mas a prioridade não sai do lugar */}
        <span className="flex items-center justify-end gap-2 pr-3 text-agente">
          <span className={`-rotate-3 rounded-md border-2 px-2 py-0.5 font-mono text-xs font-medium uppercase ${CORES_CARIMBO[chamado.status]}`}>
            {ROTULOS_STATUS[chamado.status] || chamado.status}
          </span>
          <Seta aberto={aberto} />
        </span>
      </button>

      {/* Detalhe: mapa pequeno à esquerda; dados e ações à direita (embaixo, no celular) */}
      {aberto && (
        <div id={idDetalhe} className="grid gap-4 border-t border-dashed border-agente-linha p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <MapaDoChamado chamado={chamado} />

          <div className="space-y-4">
            <p>{chamado.descricao}</p>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
              <dt className="font-semibold">Prioridade</dt>
              <dd>{ROTULOS_PRIORIDADE[chamado.prioridade] || chamado.prioridade}</dd>
              <dt className="font-semibold">Origem</dt>
              <dd>{ROTULOS_ORIGEM[chamado.origem] || chamado.origem}</dd>
              <dt className="font-semibold">Aberto em</dt>
              <dd>{formatarDataHora(chamado.criadoEm)}</dd>
              {chamado.status === 'resolvido' && (
                <>
                  <dt className="font-semibold">Resolvido em</dt>
                  <dd>{formatarDataHora(chamado.resolvidoEm)}</dd>
                </>
              )}
            </dl>
            <span className="inline-block rounded-full bg-atencao/25 px-2 py-0.5 font-mono text-[11px] tracking-wide uppercase">
              Dados simulados
            </span>

            <fieldset>
              <legend className="mb-1 text-xs font-semibold">Mudar status</legend>
              <div className="flex flex-wrap gap-2">
                {Object.entries(ROTULOS_STATUS).map(([status, rotulo]) => (
                  <button
                    key={status}
                    type="button"
                    aria-pressed={chamado.status === status}
                    disabled={chamado.status === status}
                    onClick={() => aoMudarStatus(chamado, status)}
                    className="min-h-11 rounded-lg border border-agente-linha bg-white px-3 text-sm font-medium hover:border-agente disabled:border-agente disabled:bg-agente disabled:text-white"
                  >
                    {rotulo}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Excluir pede confirmação antes, para evitar apagar sem querer */}
            {confirmando ? (
              <div role="alert" className="flex flex-wrap items-center gap-2">
                <p className="font-medium">Excluir este chamado?</p>
                <button
                  type="button"
                  onClick={() => aoExcluir(chamado.id)}
                  className="min-h-11 rounded-lg bg-critico px-3 text-sm font-medium text-white"
                >
                  Sim, excluir
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmando(false)}
                  className="min-h-11 rounded-lg border border-agente-linha bg-white px-3 text-sm font-medium"
                >
                  Não
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmando(true)}
                className="min-h-11 rounded-lg border border-critico/50 bg-white px-3 text-sm font-medium text-critico"
              >
                Excluir
              </button>
            )}
          </div>
        </div>
      )}
    </article>
  )
}

export default BilheteChamado
