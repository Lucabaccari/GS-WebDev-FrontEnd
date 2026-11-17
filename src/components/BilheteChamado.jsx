// Um chamado desenhado como bilhete: protocolo, picote, carimbo de status e "Dados simulados".
// Props:
// - chamado: o objeto vindo da API
// - aoMudarStatus(chamado, status) e aoExcluir(id): opcionais. Sem elas, o bilhete só mostra.
// - selecionado: true quando o agente clicou neste chamado no mapa (ganha destaque)
// - aoVerNoMapa(chamado): opcional. Mostra o botão "Ver no mapa".
import { useState } from 'react'
import { ROTULOS_STATUS, ROTULOS_PRIORIDADE, ROTULOS_ORIGEM, rotuloTipo, localDoChamado } from '../utils/chamados.js'
import { formatarProtocolo, formatarDataHora } from '../utils/formatadores.js'

// Cor do carimbo de cada status (o texto também muda, então não depende só da cor).
const CORES_CARIMBO = {
  aberto: 'border-critico/60 text-[#A3160F] bg-critico/5',
  em_atendimento: 'border-[#B58800] text-tinta bg-atencao/25',
  resolvido: 'border-normal/60 text-normal bg-normal/5',
}

function BilheteChamado({ chamado, aoMudarStatus, aoExcluir, selecionado = false, aoVerNoMapa }) {
  // true enquanto o bilhete pergunta "Excluir mesmo?"
  const [confirmando, setConfirmando] = useState(false)

  return (
    // id: permite rolar a fila até este bilhete quando ele é clicado no mapa
    <article
      id={`bilhete-${chamado.id}`}
      className={`overflow-hidden rounded-xl border bg-white ${selecionado ? 'border-critico ring-2 ring-critico/40' : 'border-linha shadow-suave'}`}
    >
      {/* Parte de cima: protocolo e carimbo */}
      <div className="flex items-start justify-between gap-3 p-3">
        <div>
          <p className="font-mono text-[11px] tracking-wider text-tinta-2 uppercase">Protocolo</p>
          <p className="font-letreiro text-lg font-medium">{formatarProtocolo(chamado.id)}</p>
        </div>
        <span className={`-rotate-3 rounded-md border-2 px-2 py-0.5 font-mono text-xs font-medium uppercase ${CORES_CARIMBO[chamado.status]}`}>
          {ROTULOS_STATUS[chamado.status] || chamado.status}
        </span>
      </div>

      {/* Picote: linha tracejada, como a de destacar um bilhete */}
      <div aria-hidden="true" className="border-t border-dashed border-linha" />

      <div className="space-y-2 p-3">
        <p className="text-lg leading-tight font-semibold tracking-tight">
          {rotuloTipo(chamado.tipo)} · {localDoChamado(chamado)}
        </p>
        <p>{chamado.descricao}</p>
        {aoVerNoMapa && chamado.lat !== undefined && chamado.lat !== '' && (
          <button type="button" onClick={() => aoVerNoMapa(chamado)} className="min-h-11 text-sm font-medium underline">
            Ver no mapa
          </button>
        )}

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
      </div>

      {/* Ações do agente (só aparecem se as funções foram passadas) */}
      {aoMudarStatus && aoExcluir && (
        <div className="space-y-3 border-t border-linha p-3">
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
                  className="min-h-11 border border-linha rounded-lg bg-white px-3 text-sm font-medium disabled:border-tinta disabled:bg-tinta disabled:text-white"
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
                className="min-h-11 border border-linha rounded-lg bg-critico px-3 text-sm font-medium text-white"
              >
                Sim, excluir
              </button>
              <button
                type="button"
                onClick={() => setConfirmando(false)}
                className="min-h-11 border border-linha rounded-lg bg-white px-3 text-sm font-medium"
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
      )}
    </article>
  )
}

export default BilheteChamado
