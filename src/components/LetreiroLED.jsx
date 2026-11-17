// Letreiro, como o do ônibus: texto âmbar em fonte monoespaçada sobre fundo escuro.
// Uma faixa fina e arredondada: o ícone do estado (ou um pontinho "ao vivo"), a mensagem e uma informação curta à direita.
// Props: mensagem (texto principal), info (texto pequeno, opcional) e estado (opcional:
// 'critico', 'atencao' ou 'normal'). Com estado, o pontinho vira o pictograma do estado.
import StatusPicto from './StatusPicto.jsx'

function LetreiroLED({ mensagem, info, estado }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-xl bg-painel px-4 py-3 font-letreiro text-ambar">
      <p className="flex items-center gap-3 text-sm leading-snug font-medium sm:text-base" aria-live="polite">
        {estado ? (
          // Fundo branco atrás do ícone: o visto verde e o octógono aparecem bem no letreiro escuro.
          <span aria-hidden="true" className="flex shrink-0 rounded-md bg-white p-1">
            <StatusPicto estado={estado} tamanho={18} />
          </span>
        ) : (
          // Pontinho "ao vivo" (decorativo). Respeita quem pede menos movimento (ver index.css).
          <span aria-hidden="true" className="ponto-ao-vivo h-2 w-2 shrink-0 rounded-full bg-coral" />
        )}
        {/* aria-live: o leitor de tela lê a mensagem nova quando ela muda */}
        {mensagem}
      </p>
      {info && <p className="text-xs tracking-wider whitespace-nowrap text-white/70 uppercase">{info}</p>}
    </div>
  )
}

export default LetreiroLED
