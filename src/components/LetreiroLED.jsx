// Letreiro de LED, como o do ônibus: texto âmbar na fonte Doto sobre fundo escuro.
// Reutilizável: recebe um título pequeno e a mensagem principal.

function LetreiroLED({ titulo, mensagem }) {
  return (
    <div className="border-[3px] border-asfalto bg-painel px-4 py-3 font-letreiro text-ambar shadow-dura">
      {titulo && <p className="text-sm tracking-widest uppercase opacity-80">{titulo}</p>}
      {/* aria-live: o leitor de tela lê a mensagem nova quando ela muda */}
      <p className="text-xl leading-snug font-bold uppercase sm:text-2xl" aria-live="polite">
        {mensagem}
      </p>
    </div>
  )
}

export default LetreiroLED
