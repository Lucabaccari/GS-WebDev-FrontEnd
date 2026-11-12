// Botão principal do cidadão: "Avisar problema", vermelho, por cima do mapa.
// Abre o formulário para o cidadão contar o que viu na rua.
// Props: aoClicar (função) e aberto (true quando o formulário já está aberto).

function BotaoAvisar({ aoClicar, aberto }) {
  return (
    <button
      type="button"
      onClick={aoClicar}
      aria-expanded={aberto}
      aria-controls="form-chamado"
      className="flex min-h-12 items-center justify-center gap-2 border-[3px] border-asfalto bg-critico px-5 text-lg font-black text-white uppercase shadow-dura active:translate-x-1 active:translate-y-1 active:shadow-none"
    >
      {/* Pictograma: alfinete de mapa com um "!" (um problema num lugar), desenhado em SVG */}
      <svg width="22" height="26" viewBox="0 0 22 26" aria-hidden="true">
        <path d="M11 25 C11 25 2 15.5 2 10 A9 9 0 0 1 20 10 C20 15.5 11 25 11 25 Z" fill="#FFFFFF" stroke="#1B1C1E" strokeWidth="1.5" />
        <rect x="9.75" y="4.5" width="2.5" height="7" fill="#D7261E" />
        <rect x="9.75" y="13.5" width="2.5" height="2.5" fill="#D7261E" />
      </svg>
      Avisar problema
    </button>
  )
}

export default BotaoAvisar
