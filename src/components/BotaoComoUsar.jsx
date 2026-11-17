// Botão "Como usar": abre o tour guiado da tela de novo.
// No celular aparece só o "?" num círculo de 44 px; a partir do tablet, com o texto.
// Props: aoClicar (abre o tour) e className (posição e ajustes de quem usa o botão).

function BotaoComoUsar({ aoClicar, className = '' }) {
  return (
    <button
      type="button"
      onClick={aoClicar}
      aria-label="Como usar esta tela"
      className={`flex h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-linha bg-white text-sm font-medium text-tinta shadow-suave hover:border-tinta sm:px-4 ${className}`}
    >
      <span aria-hidden="true" className="flex h-5 w-5 items-center justify-center rounded-full border border-tinta font-mono text-xs">
        ?
      </span>
      <span aria-hidden="true" className="hidden sm:inline">
        Como usar
      </span>
    </button>
  )
}

export default BotaoComoUsar
