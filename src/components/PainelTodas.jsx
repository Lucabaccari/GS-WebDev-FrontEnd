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

function PainelTodas({ ruas, camada, frota, aoVerRua }) {
  return (
    <section aria-labelledby="titulo-todas">
      <h2 id="titulo-todas" className="mb-3 text-2xl font-semibold tracking-tight">
        As 6 ruas agora
      </h2>
      <ul className="grid gap-x-3 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
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
            <li key={rua.id} className="row-span-5 grid grid-rows-subgrid gap-y-3 rounded-lg border border-linha bg-white p-3">
              {/* 1. Nome da rua (o estado aparece em cada ocorrência, logo abaixo) */}
              <h3 className="text-lg leading-tight font-semibold tracking-tight">{rua.nome}</h3>

              {/* 2. Resumo dos pontos */}
              <p className="text-sm">{textoResumo(resumo)}</p>

              {/* 3. Ocorrências: ícone do tipo + nome e lugar + estado (forma e texto, nunca só cor) */}
              <ul className="space-y-2 text-sm">
                {problemas.length === 0 && <li className="text-tinta-2">Nenhuma ocorrência agora.</li>}
                {problemas.map((p) => (
                  <li key={p.id} className="flex items-center gap-2">
                    <IconeProblema tipo={p.tipo} tamanho={26} />
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
                  A marca âmbar mostra a posição; a seta, o sentido (ida ou volta). */}
              <div className="self-end">
                <div className="relative h-2 rounded-full bg-linha" aria-hidden="true">
                  <span
                    className="absolute -top-1 h-4 w-1.5 -translate-x-1/2 rounded-sm border border-tinta/40 bg-ambar"
                    style={{ left: `${onibus.fracao * 100}%` }}
                  />
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
