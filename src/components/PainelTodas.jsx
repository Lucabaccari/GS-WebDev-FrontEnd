// Resumo das 6 ruas, mostrado na visão "Todas as ruas" (embaixo do mapa amplo).
// Cada cartão: pior estado, ocorrências com a numeração, onde está o ônibus daquela rua
// (com uma barrinha do trajeto) e o botão "Ver rua".
//
// Props: ruas, camada, frota (os 6 ônibus do useOnibus), aoVerRua(id).
import StatusPicto from './StatusPicto.jsx'
import { CAMADAS, resumirRua, textoResumo } from '../utils/classificar.js'

function PainelTodas({ ruas, camada, frota, aoVerRua }) {
  return (
    <section aria-labelledby="titulo-todas">
      <h2 id="titulo-todas" className="mb-3 text-2xl font-black uppercase [font-stretch:75%]">
        As 6 ruas agora
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ruas.map((rua) => {
          const resumo = resumirRua(rua, camada)
          const onibus = frota.find((o) => o.ruaId === rua.id)
          // Lugares com problema nesta rua (na camada escolhida, ou em qualquer uma no "Geral").
          const camadas = camada === 'geral' ? Object.keys(CAMADAS) : [camada]
          const problemas = rua.pontos.flatMap((p) =>
            camadas
              .filter((c) => p.estados[c] === 'atencao' || p.estados[c] === 'critico')
              .map((c) => ({ id: `${p.id}-${c}`, estado: p.estados[c], texto: `${CAMADAS[c].nome} · ${p.locais[c].nome}` })),
          )

          return (
            <li key={rua.id} className="flex flex-col border-2 border-asfalto bg-white p-3">
              <div className="flex items-center gap-2">
                <StatusPicto estado={resumo.pior} tamanho={22} />
                <h3 className="text-lg leading-tight font-black uppercase [font-stretch:75%]">{rua.nome}</h3>
              </div>
              <p className="mt-1 text-sm">{textoResumo(resumo)}</p>

              {problemas.length > 0 && (
                <ul className="mt-2 space-y-1 text-sm">
                  {problemas.map((p) => (
                    <li key={p.id} className="flex items-center gap-2">
                      <StatusPicto estado={p.estado} tamanho={14} />
                      <span className="tabular-nums">{p.texto}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Onde está o ônibus desta rua: barrinha da rua (nº 1 à esquerda) + trecho de 100 m.
                  A marca âmbar mostra a posição; a seta, o sentido (ida ou volta). */}
              <div className="mt-3">
                <div className="relative h-2 border border-asfalto bg-concreto" aria-hidden="true">
                  <span
                    className="absolute -top-1 h-4 w-1.5 -translate-x-1/2 border border-asfalto bg-ambar"
                    style={{ left: `${onibus.fracao * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-xs font-semibold tabular-nums">
                  Ônibus {onibus.parado ? 'parado' : onibus.indo ? 'indo →' : '← voltando'} no {onibus.trecho}
                </p>
              </div>

              <button
                type="button"
                onClick={() => aoVerRua(rua.id)}
                className="mt-3 min-h-11 w-full border-2 border-asfalto bg-white px-3 text-sm font-bold hover:bg-concreto"
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
