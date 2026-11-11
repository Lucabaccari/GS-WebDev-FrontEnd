// Abas para trocar de tela (Cidadão / Agente).
// São <button> de verdade: funcionam com mouse, toque e teclado.
// No teclado: Tab chega na aba e as setas ← → trocam de aba (padrão de acessibilidade).
//
// Props:
// - abas: lista de { id, rotulo }
// - ativa: id da aba selecionada
// - aoTrocar: função chamada com o id da aba clicada

function Abas({ abas, ativa, aoTrocar }) {
  // Setas: vai para a aba vizinha e coloca o foco nela.
  function aoApertarTecla(evento, indice) {
    if (evento.key !== 'ArrowRight' && evento.key !== 'ArrowLeft') return
    const passo = evento.key === 'ArrowRight' ? 1 : -1
    // O "%" faz dar a volta: depois da última aba vem a primeira.
    const proxima = abas[(indice + passo + abas.length) % abas.length]
    aoTrocar(proxima.id)
    document.getElementById(`aba-${proxima.id}`).focus()
  }

  return (
    <div role="tablist" aria-label="Escolha a tela" className="flex">
      {abas.map((aba, indice) => {
        const selecionada = aba.id === ativa
        return (
          <button
            key={aba.id}
            type="button"
            role="tab"
            id={`aba-${aba.id}`}
            aria-selected={selecionada}
            aria-controls="conteudo"
            // Só a aba selecionada entra na ordem do Tab; as outras se alcança pelas setas.
            tabIndex={selecionada ? 0 : -1}
            onClick={() => aoTrocar(aba.id)}
            onKeyDown={(e) => aoApertarTecla(e, indice)}
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
