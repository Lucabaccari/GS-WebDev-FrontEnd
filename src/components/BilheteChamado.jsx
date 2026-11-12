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
  aberto: 'border-critico text-critico',
  em_atendimento: 'border-asfalto text-asfalto bg-atencao',
  resolvido: 'border-normal text-normal',
}

function BilheteChamado({ chamado, aoMudarStatus, aoExcluir, selecionado = false, aoVerNoMapa }) {
  // true enquanto o bilhete pergunta "Excluir mesmo?"
  const [confirmando, setConfirmando] = useState(false)

  return (
    // id: permite rolar a fila até este bilhete quando ele é clicado no mapa
    <article
      id={`bilhete-${chamado.id}`}
      className={`border-[3px] bg-white ${selecionado ? 'border-critico shadow-[6px_6px_0_0_#D7261E]' : 'border-asfalto shadow-dura'}`}
    >
      {/* Parte de cima: protocolo e carimbo */}
      <div className="flex items-start justify-between gap-3 p-3">
        <div>
          <p className="text-xs font-bold uppercase">Protocolo</p>
          <p className="font-letreiro text-xl font-bold">{formatarProtocolo(chamado.id)}</p>
        </div>
        <span className={`-rotate-6 border-[3px] px-2 py-1 text-sm font-black uppercase ${CORES_CARIMBO[chamado.status]}`}>
          {ROTULOS_STATUS[chamado.status] || chamado.status}
        </span>
      </div>

      {/* Picote: linha tracejada, como a de destacar um bilhete */}
      <div aria-hidden="true" className="border-t-2 border-dashed border-asfalto" />

      <div className="space-y-2 p-3">
        <p className="text-lg leading-tight font-black uppercase [font-stretch:75%]">
          {rotuloTipo(chamado.tipo)} · {localDoChamado(chamado)}
        </p>
        <p>{chamado.descricao}</p>
        {aoVerNoMapa && chamado.lat !== undefined && chamado.lat !== '' && (
          <button type="button" onClick={() => aoVerNoMapa(chamado)} className="min-h-11 text-sm font-bold underline">
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

        <span className="inline-block border-2 border-asfalto bg-atencao px-2 text-xs font-bold uppercase">
          Dados simulados
        </span>
      </div>

      {/* Ações do agente (só aparecem se as funções foram passadas) */}
      {aoMudarStatus && aoExcluir && (
        <div className="space-y-3 border-t-2 border-asfalto p-3">
          <fieldset>
            <legend className="mb-1 text-xs font-bold uppercase">Mudar status</legend>
            <div className="flex flex-wrap gap-2">
              {Object.entries(ROTULOS_STATUS).map(([status, rotulo]) => (
                <button
                  key={status}
                  type="button"
                  aria-pressed={chamado.status === status}
                  disabled={chamado.status === status}
                  onClick={() => aoMudarStatus(chamado, status)}
                  className="min-h-11 border-2 border-asfalto bg-white px-3 text-sm font-bold disabled:bg-asfalto disabled:text-white"
                >
                  {rotulo}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Excluir pede confirmação antes, para evitar apagar sem querer */}
          {confirmando ? (
            <div role="alert" className="flex flex-wrap items-center gap-2">
              <p className="font-bold">Excluir este chamado?</p>
              <button
                type="button"
                onClick={() => aoExcluir(chamado.id)}
                className="min-h-11 border-2 border-asfalto bg-critico px-3 text-sm font-bold text-white"
              >
                Sim, excluir
              </button>
              <button
                type="button"
                onClick={() => setConfirmando(false)}
                className="min-h-11 border-2 border-asfalto bg-white px-3 text-sm font-bold"
              >
                Não
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmando(true)}
              className="min-h-11 border-2 border-critico bg-white px-3 text-sm font-bold text-critico"
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
