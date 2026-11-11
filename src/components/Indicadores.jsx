// Indicadores do painel do Agente, em placas (sem setinhas de alta/baixa, como pede o guia).
// Recebe os números prontos de utils/indicadores.js pela prop "dados".
import { CAMADAS } from '../utils/classificar.js'
import { formatarDuracao } from '../utils/formatadores.js'

// Uma placa: número grande + nome. A faixa de cima reforça o significado com cor.
function Placa({ rotulo, valor, faixa }) {
  return (
    <div className="border-[3px] border-asfalto bg-white shadow-dura">
      <div aria-hidden="true" className={`h-2 border-b-2 border-asfalto ${faixa}`} />
      <div className="p-3">
        <p className="text-3xl font-black tabular-nums">{valor}</p>
        <p className="text-sm font-bold uppercase">{rotulo}</p>
      </div>
    </div>
  )
}

function Indicadores({ dados }) {
  // O tipo com mais chamados define o tamanho de 100% das barras.
  const maior = Math.max(1, ...Object.values(dados.porTipo))

  return (
    <section aria-labelledby="titulo-indicadores" className="space-y-4">
      <h2 id="titulo-indicadores" className="text-2xl font-black uppercase [font-stretch:75%]">
        Indicadores
      </h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Placa rotulo="Abertos" valor={dados.abertos} faixa="bg-critico" />
        <Placa rotulo="Em atendimento" valor={dados.emAtendimento} faixa="bg-atencao" />
        <Placa rotulo="Resolvidos" valor={dados.resolvidos} faixa="bg-normal" />
        <Placa rotulo="Tempo médio p/ resolver" valor={formatarDuracao(dados.tempoMedioMin)} faixa="bg-asfalto" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Barras simples: largura proporcional ao número de chamados de cada tipo */}
        <div className="border-2 border-asfalto bg-white p-3">
          <h3 className="mb-2 text-sm font-bold uppercase">Chamados por tipo</h3>
          <ul className="space-y-2">
            {Object.entries(CAMADAS).map(([tipo, regra]) => {
              const quantidade = dados.porTipo[tipo] || 0
              return (
                <li key={tipo} className="grid grid-cols-[7rem_1fr_2rem] items-center gap-2 text-sm">
                  <span className="font-semibold">{regra.nome}</span>
                  <span className="h-4 border-2 border-asfalto bg-concreto">
                    <span className="block h-full bg-asfalto" style={{ width: `${(quantidade / maior) * 100}%` }} />
                  </span>
                  <span className="text-right font-bold tabular-nums">{quantidade}</span>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="border-2 border-asfalto bg-white p-3">
          <h3 className="mb-2 text-sm font-bold uppercase">Quem abriu</h3>
          <dl className="grid grid-cols-[1fr_auto] gap-y-2 text-sm">
            <dt className="font-semibold">Automático (sensores)</dt>
            <dd className="font-bold tabular-nums">{dados.automaticos}</dd>
            <dt className="font-semibold">Cidadão</dt>
            <dd className="font-bold tabular-nums">{dados.doCidadao}</dd>
            <dt className="font-semibold">Total</dt>
            <dd className="font-bold tabular-nums">{dados.total}</dd>
          </dl>
        </div>
      </div>
    </section>
  )
}

export default Indicadores
