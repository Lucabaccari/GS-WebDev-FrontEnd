// Abas para trocar de tela (Cidadão / Agente).
// São <button> de verdade: funcionam com mouse, toque e teclado.
// No teclado: Tab chega na aba e as setas ← → trocam de aba (padrão de acessibilidade).
//
// Props:
// - abas: lista de { id, rotulo }
// - ativa: id da aba selecionada
// - aoTrocar: função chamada com o id da aba clicada
// - escuro: true quando as abas ficam sobre fundo escuro (topo do Início)

function Abas({ abas, ativa, aoTrocar, escuro = false }) {
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
    // Um "controle segmentado": as abas ficam juntas numa pílula, e a ativa ganha destaque.
    <div
      role="tablist"
      aria-label="Escolha a tela"
      className={`flex rounded-full p-1 ${escuro ? 'bg-white/10' : 'bg-papel ring-1 ring-linha'}`}
    >
      {abas.map((aba, indice) => {
        const selecionada = aba.id === ativa
        // Cores da aba conforme o fundo (claro ou escuro) e se está selecionada.
        const cores = escuro
          ? selecionada
            ? 'bg-white text-tinta'
            : 'text-white/80 hover:text-white'
          : selecionada
            ? 'bg-tinta text-white shadow-suave'
            : 'text-tinta-2 hover:text-tinta'
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
            className={`min-h-11 rounded-full px-4 text-sm font-medium transition-colors ${cores}`}
          >
            {aba.rotulo}
          </button>
        )
      })}
    </div>
  )
}

export default Abas
