// Letreiro de LED, como o do ônibus: texto âmbar na fonte Doto sobre fundo escuro.
// Agora é uma faixa fina: a mensagem à esquerda e uma informação curta à direita.
// Props: mensagem (texto principal) e info (texto pequeno, opcional, ex.: "Passagem 12").

function LetreiroLED({ mensagem, info }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 bg-painel px-4 py-2.5 font-letreiro text-ambar">
      {/* aria-live: o leitor de tela lê a mensagem nova quando ela muda */}
      <p className="text-lg leading-snug font-bold uppercase sm:text-xl" aria-live="polite">
        {mensagem}
      </p>
      {info && <p className="text-sm tracking-widest whitespace-nowrap uppercase">{info}</p>}
    </div>
  )
}

export default LetreiroLED
