// Abas para trocar de tela (Cidadão / Agente).
// São <button> de verdade: funcionam com mouse, toque e teclado (Tab + Enter).
//
// Props:
// - abas: lista de { id, rotulo }
// - ativa: id da aba selecionada
// - aoTrocar: função chamada com o id da aba clicada

function Abas({ abas, ativa, aoTrocar }) {
  return (
    <div role="tablist" aria-label="Escolha a tela" className="flex">
      {abas.map((aba) => {
        const selecionada = aba.id === ativa
        return (
          <button
            key={aba.id}
            type="button"
            role="tab"
            id={`aba-${aba.id}`}
            aria-selected={selecionada}
            aria-controls={`painel-${aba.id}`}
            onClick={() => aoTrocar(aba.id)}
            className={`min-h-11 border-2 border-asfalto px-4 font-bold uppercase -ml-0.5 first:ml-0 ${
              selecionada ? 'bg-asfalto text-white' : 'bg-white text-asfalto hover:bg-concreto'
            }`}
          >
            {aba.rotulo}
          </button>
        )
      })}
    </div>
  )
}

export default Abas
