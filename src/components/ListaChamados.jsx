// Lista de bilhetes da fila do Agente, um embaixo do outro.
// Cuida das situações "carregando", "erro" e "lista vazia".
// Props: chamados, carregando, erro, aoTentarDeNovo, aoMudarStatus, aoExcluir,
// abertoId (chamado com o detalhe aberto) e aoAbrir(id).
import BilheteChamado from './BilheteChamado.jsx'

function ListaChamados({ chamados, carregando, erro, aoTentarDeNovo, aoMudarStatus, aoExcluir, abertoId, aoAbrir }) {
  if (carregando) {
    return <p className="font-medium" role="status">Carregando chamados...</p>
  }

  return (
    <div className="space-y-3">
      {erro && (
        <div role="alert" className="flex flex-wrap items-center gap-3 rounded-lg bg-critico p-3 font-medium text-white">
          <p>{erro}</p>
          <button type="button" onClick={aoTentarDeNovo} className="min-h-11 rounded-lg bg-white px-3 text-tinta">
            Tentar de novo
          </button>
        </div>
      )}

      {chamados.length === 0 ? (
        <p className="rounded-xl border border-dashed border-agente-linha bg-white p-4">Nenhum chamado por aqui.</p>
      ) : (
        <ol className="space-y-3">
          {chamados.map((chamado) => (
            <li key={chamado.id}>
              <BilheteChamado
                chamado={chamado}
                aberto={chamado.id === abertoId}
                aoAbrir={() => aoAbrir(chamado.id)}
                aoMudarStatus={aoMudarStatus}
                aoExcluir={aoExcluir}
              />
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

export default ListaChamados
