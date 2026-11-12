// Painel da viagem do ônibus de uma rua: em que passagem está, onde está (numeração),
// se está parado numa parada e uma barra com o trajeto e as paradas marcadas.
//
// Props: onibus (estado de um ônibus, do useOnibus), trajeto (de utils/rota.js).
import { formatarRelogio } from '../utils/formatadores.js'
import { ESPACO_ENTRE_PONTOS_M } from '../data/ruas.js'

function PainelViagem({ onibus, trajeto }) {
  return (
    <section aria-labelledby="titulo-viagem" className="bg-painel p-3 text-white">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="titulo-viagem" className="text-xs font-bold tracking-widest text-ambar uppercase">
          Ônibus com sensor · passagem {onibus.passagem} · {onibus.indo ? 'ida' : 'volta'}
        </h2>
        <p className="text-xs tabular-nums">fim em {formatarRelogio(onibus.faltaMs)}</p>
      </div>

      <p className="mt-1 font-letreiro text-2xl leading-tight text-ambar uppercase">Altura do nº {onibus.numero}</p>
      {/* aria-live: o leitor de tela avisa quando o ônibus para ou volta a andar */}
      <p className="text-sm" aria-live="polite">
        {onibus.parado
          ? `Parado na parada ${onibus.numeroParada} de ${onibus.totalParadas}. O sensor continua medindo.`
          : `Andando e medindo a cada ${ESPACO_ENTRE_PONTOS_M} m.`}
      </p>

      {/* Barra da rua (nº 1 à esquerda, último número à direita). O preenchimento âmbar é o
          pedaço já percorrido nesta passagem: na ida cresce da esquerda, na volta, da direita.
          As marcas são as paradas de ônibus, no lugar certo da rua. */}
      <div
        className="relative mt-3 h-3 border border-white/60 bg-white/10"
        role="progressbar"
        aria-label={`Trajeto do ônibus na ${onibus.ruaNome}, ${onibus.indo ? 'na ida' : 'na volta'}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round((onibus.rastro[1] - onibus.rastro[0]) * 100)}
      >
        <div
          className="absolute inset-y-0 bg-ambar"
          style={{ left: `${onibus.rastro[0] * 100}%`, width: `${(onibus.rastro[1] - onibus.rastro[0]) * 100}%` }}
        />
        {trajeto.paradas.map((fracao, i) => {
          const jaPassou = fracao >= onibus.rastro[0] && fracao <= onibus.rastro[1]
          return (
            <span
              key={i}
              aria-hidden="true"
              className={`absolute -top-1 h-5 w-1.5 -translate-x-1/2 border border-painel ${jaPassou ? 'bg-ambar' : 'bg-white'}`}
              style={{ left: `${fracao * 100}%` }}
            />
          )
        })}
      </div>
      <div className="mt-1.5 flex justify-between text-xs tabular-nums">
        <span>nº 1</span>
        <span>{onibus.indo ? 'indo →' : '← voltando'}</span>
        <span>nº {trajeto.comprimentoM}</span>
      </div>
    </section>
  )
}

export default PainelViagem
