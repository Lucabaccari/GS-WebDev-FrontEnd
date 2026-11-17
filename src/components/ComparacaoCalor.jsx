// Comparação de calor entre dois bairros vizinhos, com dois "termômetros" (como no vídeo do grupo).
// Quando a seção aparece na tela pela primeira vez, a temperatura SOBE: o número conta de 20 °C
// até o valor real e a coluna do termômetro enche junto. (Sem animação para quem pede menos movimento.)
// Props: titulo, texto, bairros ([{ nome, valor, estado }]) e nota. (A fonte fica no rodapé do Início.)
import { Fragment } from 'react'
import StatusPicto from './StatusPicto.jsx'
import { useNaTela } from '../hooks/useNaTela.js'
import { useContagem } from '../hooks/useContagem.js'

const MINIMO = 20 // base da escala do termômetro (°C)
const MAXIMO = 50 // topo da escala
const COR = { critico: 'bg-critico', atencao: 'bg-atencao', normal: 'bg-normal' }
const MARCAS = [20, 30, 40, 50] // risquinhos da escala

// Um termômetro: o número e a coluna usam o mesmo valor animado.
function Termometro({ nome, valor, estado, ativo, atrasoMs }) {
  const atual = useContagem({ de: MINIMO, ate: valor, ativo, duracaoMs: 1800 + atrasoMs })
  const altura = ((atual - MINIMO) / (MAXIMO - MINIMO)) * 100

  return (
    <div className="flex items-end gap-4">
      {/* Escala com risquinhos + coluna */}
      <div className="relative h-56 w-10">
        {MARCAS.map((m) => (
          <span
            key={m}
            aria-hidden="true"
            className="absolute left-0 flex w-full items-center gap-1 font-mono text-[10px] text-white/40"
            style={{ bottom: `${((m - MINIMO) / (MAXIMO - MINIMO)) * 100}%` }}
          >
            <span className="h-px w-2 bg-white/30" />
            {m}
          </span>
        ))}
        <div className="absolute right-0 bottom-0 h-full w-3 overflow-hidden rounded-full bg-white/10">
          <div className={`absolute inset-x-0 bottom-0 rounded-full ${COR[estado]}`} style={{ height: `${altura}%` }} />
        </div>
      </div>
      <div>
        <StatusPicto estado={estado} tamanho={20} />
        <p className="mt-1 text-6xl font-medium tracking-tighter tabular-nums sm:text-7xl">
          {Math.round(atual)}
          <span className="ml-1 align-top text-xl text-white/50">°C</span>
        </p>
        <p className="mt-1 font-mono text-xs tracking-wider text-white/70 uppercase">{nome}</p>
      </div>
    </div>
  )
}

function ComparacaoCalor({ titulo, texto, bairros, nota }) {
  // ref vai no cartão; "apareceu" vira true quando 35% dele entra na tela.
  const [ref, apareceu] = useNaTela(0.35)

  return (
    <article ref={ref} className="relative overflow-hidden rounded-3xl bg-tinta p-6 text-white md:p-10">
      <div className="relative grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-coral uppercase">Temperatura de superfície</p>
          <h3 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">{titulo}</h3>
          <p className="mt-4 max-w-md text-white/75">{texto}</p>
          <p className="mt-6 max-w-md font-mono text-[11px] leading-relaxed text-white/60">
            {nota}
          </p>
        </div>

        {/* Os dois termômetros. role="img" + aria-label: o leitor de tela lê o resumo (sem esperar a animação). */}
        <div className="flex items-end gap-5 sm:gap-8" role="img" aria-label={bairros.map((b) => `${b.nome}: ${b.valor} °C`).join(', ')}>
          {bairros.map((b, i) => (
            <Fragment key={b.nome}>
              {/* Entre os dois termômetros: a diferença, em tamanho discreto */}
              {i === 1 && (
                <span aria-hidden="true" className="mb-28 flex flex-col items-center font-mono text-coral">
                  <span className="text-2xl font-medium">+15°</span>
                  <span className="text-[11px] text-white/60">diferença</span>
                </span>
              )}
              <Termometro {...b} ativo={apareceu} atrasoMs={i * 300} />
            </Fragment>
          ))}
        </div>
      </div>
    </article>
  )
}

export default ComparacaoCalor
