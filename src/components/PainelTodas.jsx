// Resumo das 6 ruas, mostrado na visão "Todas as ruas" (embaixo do mapa amplo).
// Cada cartão: nome, resumo, ocorrências (com o ícone do tipo do problema e a numeração), onde está
// o ônibus daquela rua (com uma barrinha do trajeto) e o botão "Ver rua".
//
// Alinhamento: cada cartão tem 5 partes, e a grade usa "subgrid" para que a mesma parte
// fique na mesma altura em todos os cartões lado a lado (a barrinha do ônibus e o botão
// ficam alinhados mesmo quando uma rua tem mais ocorrências que a outra).
//
// Props: ruas, camada, frota (os 6 ônibus do useOnibus), aoVerRua(id).
import StatusPicto from './StatusPicto.jsx'
import IconeProblema from './IconeProblema.jsx'
import { CAMADAS, ROTULOS_ESTADO, resumirRua, textoResumo } from '../utils/classificar.js'

// O ônibus do mapa (visto de cima, com a caixa de sensores âmbar), deitado na barrinha:
// a frente aponta para a direita na ida e para a esquerda na volta.
function OnibusMini({ indo }) {
  return (
    <svg width="34" height="17" viewBox="-32 -16 64 32" className={`block ${indo ? '' : 'rotate-180'}`}>
      <g transform="rotate(90)">
        <rect x="-13" y="-30" width="26" height="60" rx="7" fill="#1B1C1E" stroke="#FFFFFF" strokeWidth="2.5" />
        <rect x="-9" y="-26" width="18" height="7" rx="2" fill="#BFD3E0" />
        <rect x="-9" y="22" width="18" height="3" rx="1" fill="#5A5C60" />
        <rect x="-7" y="-10" width="14" height="16" fill="#FFB000" stroke="#1B1C1E" strokeWidth="1.5" />
      </g>
    </svg>
  )
}

function PainelTodas({ ruas, camada, frota, aoVerRua }) {
  return (
    <section aria-labelledby="titulo-todas">
      <h2 id="titulo-todas" className="mb-3 text-2xl font-semibold tracking-tight">
        As 6 ruas agora
      </h2>
      <ul className="grid gap-x-3 gap-y-2 sm:grid-cols-2 sm:gap-y-3 lg:grid-cols-3">
        {ruas.map((rua) => {
          const resumo = resumirRua(rua, camada)
          const onibus = frota.find((o) => o.ruaId === rua.id)
          // Lugares com problema nesta rua (na camada escolhida, ou em qualquer uma no "Geral").
          const camadas = camada === 'geral' ? Object.keys(CAMADAS) : [camada]
          const problemas = rua.pontos.flatMap((p) =>
            camadas
              .filter((c) => p.estados[c] === 'atencao' || p.estados[c] === 'critico')
              .map((c) => ({ id: `${p.id}-${c}`, tipo: c, estado: p.estados[c], nome: CAMADAS[c].nome, local: p.locais[c].nome })),
          )

          return (
            // row-span-5 + grid-rows-subgrid: as 5 partes do cartão usam as linhas da grade de fora.
            <li key={rua.id} className="row-span-5 grid grid-rows-subgrid gap-y-2 rounded-lg border border-linha bg-white p-3 sm:gap-y-3">
              {/* 1. Nome da rua (o estado aparece em cada ocorrência, logo abaixo) */}
              <h3 className="text-base leading-tight font-semibold tracking-tight sm:text-lg">{rua.nome}</h3>

              {/* 2. Resumo dos pontos */}
              <p className="text-sm">{textoResumo(resumo)}</p>

              {/* 3. Ocorrências: ícone do tipo + nome e lugar + estado (forma e texto, nunca só cor) */}
              <ul className="space-y-1.5 text-sm sm:space-y-2">
                {problemas.length === 0 && <li className="text-tinta-2">Nenhuma ocorrência agora.</li>}
                {problemas.map((p) => (
                  <li key={p.id} className="flex items-center gap-2">
                    <IconeProblema tipo={p.tipo} tamanho={24} />
                    <span className="min-w-0 flex-1 leading-tight tabular-nums">
                      {p.nome}
                      <span className="block text-xs text-tinta-2">{p.local}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1 text-xs text-tinta-2">
                      <StatusPicto estado={p.estado} tamanho={14} />
                      {ROTULOS_ESTADO[p.estado]}
                    </span>
                  </li>
                ))}
              </ul>

              {/* 4. Onde está o ônibus desta rua: barrinha da rua (nº 1 à esquerda) + trecho de 100 m.
                  O mesmo ônibus do mapa mostra a posição, virado para o sentido (ida → ou volta ←). */}
              <div className="self-end">
                <div className="relative mt-2 h-2 rounded-full bg-linha" aria-hidden="true">
                  <span className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${onibus.fracao * 100}%` }}>
                    <OnibusMini indo={onibus.indo} />
                  </span>
                </div>
                <p className="mt-1 text-xs font-semibold tabular-nums">
                  Ônibus {onibus.parado ? 'parado' : onibus.indo ? 'indo →' : '← voltando'} no {onibus.trecho}
                </p>
              </div>

              {/* 5. Botão */}
              <button
                type="button"
                onClick={() => aoVerRua(rua.id)}
                className="min-h-11 w-full rounded-lg border border-linha bg-white px-3 text-sm font-medium hover:bg-concreto"
              >
                Ver rua e seguir o ônibus
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default PainelTodas
