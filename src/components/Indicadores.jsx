// Indicadores do painel do Agente, em placas (sem setinhas de alta/baixa, como pede o guia).
// Recebe os números prontos de utils/indicadores.js pela prop "dados".
import { TIPOS_DE_PROBLEMA } from '../utils/chamados.js'
import { formatarDuracao } from '../utils/formatadores.js'

// Uma placa: rótulo pequeno (com um pontinho da cor do status) + número grande.
function Placa({ rotulo, valor, faixa }) {
  return (
    <div className="rounded-xl border border-agente-linha bg-white p-4 shadow-suave">
      <p className="flex items-center gap-2 font-mono text-[11px] tracking-wider text-tinta-2 uppercase">
        <span aria-hidden="true" className={`h-2 w-2 rounded-full ${faixa}`} />
        {rotulo}
      </p>
      <p className="mt-2 text-3xl font-medium tracking-tight tabular-nums">{valor}</p>
    </div>
  )
}

function Indicadores({ dados }) {
  // O tipo com mais chamados define o tamanho de 100% das barras.
  const maior = Math.max(1, ...Object.values(dados.porTipo))

  return (
    <section aria-labelledby="titulo-indicadores" className="space-y-4">
      <h2 id="titulo-indicadores" className="text-2xl font-semibold tracking-tight">
        Indicadores
      </h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Placa rotulo="Abertos" valor={dados.abertos} faixa="bg-critico" />
        <Placa rotulo="Em atendimento" valor={dados.emAtendimento} faixa="bg-atencao" />
        <Placa rotulo="Resolvidos" valor={dados.resolvidos} faixa="bg-normal" />
        <Placa rotulo="Tempo médio p/ resolver" valor={formatarDuracao(dados.tempoMedioMin)} faixa="bg-agente" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Barras simples: largura proporcional ao número de chamados de cada tipo */}
        <div className="rounded-xl border border-agente-linha bg-white p-3">
          <h3 className="mb-2 text-sm font-semibold">Chamados por tipo</h3>
          <ul className="space-y-2">
            {TIPOS_DE_PROBLEMA.map(({ id: tipo, nome }) => {
              const quantidade = dados.porTipo[tipo] || 0
              return (
                <li key={tipo} className="grid grid-cols-[7rem_1fr_2rem] items-center gap-2 text-sm">
                  <span className="font-semibold">{nome}</span>
                  <span className="h-2 overflow-hidden rounded-full bg-agente-fundo">
                    <span className="block h-full rounded-full bg-agente" style={{ width: `${(quantidade / maior) * 100}%` }} />
                  </span>
                  <span className="text-right font-medium tabular-nums">{quantidade}</span>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="rounded-xl border border-agente-linha bg-white p-3">
          <h3 className="mb-2 text-sm font-semibold">Quem abriu</h3>
          <dl className="grid grid-cols-[1fr_auto] gap-y-2 text-sm">
            <dt className="font-semibold">Automático (sensores)</dt>
            <dd className="font-medium tabular-nums">{dados.automaticos}</dd>
            <dt className="font-semibold">Cidadão</dt>
            <dd className="font-medium tabular-nums">{dados.doCidadao}</dd>
            <dt className="font-semibold">Total</dt>
            <dd className="font-medium tabular-nums">{dados.total}</dd>
          </dl>
        </div>
      </div>
    </section>
  )
}

export default Indicadores
