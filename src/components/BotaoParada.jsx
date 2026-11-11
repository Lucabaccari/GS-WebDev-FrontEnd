// Botão principal do cidadão: "Solicitar parada", vermelho, como o botão do ônibus.
// Props: aoClicar (função) e aberto (true quando o formulário já está aberto).

function BotaoParada({ aoClicar, aberto }) {
  return (
    <button
      type="button"
      onClick={aoClicar}
      aria-expanded={aberto}
      aria-controls="form-chamado"
      className="flex min-h-14 w-full items-center justify-center gap-3 border-[3px] border-asfalto bg-critico px-6 text-xl font-black text-white uppercase shadow-dura active:translate-x-1 active:translate-y-1 active:shadow-none sm:w-auto"
    >
      {/* Pictograma de mão levantada pedindo parada, desenhado em SVG */}
      <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M7 11V5a1.5 1.5 0 0 1 3 0v5M10 10V3.5a1.5 1.5 0 0 1 3 0V10M13 10V4.5a1.5 1.5 0 0 1 3 0V11M16 11V7.5a1.5 1.5 0 0 1 3 0V14c0 4-2.5 7-6.5 7S6 18.5 5 16l-1.5-3.5a1.5 1.5 0 0 1 2.6-1.4L7 13"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
      Solicitar parada
    </button>
  )
}

export default BotaoParada
