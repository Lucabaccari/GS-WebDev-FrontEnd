// Lista de bilhetes. Cuida das situações "carregando", "erro" e "lista vazia".
// Props: chamados, carregando, erro, aoTentarDeNovo, aoMudarStatus, aoExcluir,
// selecionadoId (chamado em destaque) e aoVerNoMapa (opcional).
import BilheteChamado from './BilheteChamado.jsx'

function ListaChamados({
  chamados,
  carregando,
  erro,
  aoTentarDeNovo,
  aoMudarStatus,
  aoExcluir,
  selecionadoId,
  aoVerNoMapa,
}) {
  if (carregando) {
    return <p className="font-medium" role="status">Carregando chamados...</p>
  }

  return (
    <div className="space-y-4">
      {erro && (
        <div role="alert" className="flex flex-wrap items-center gap-3 border border-linha rounded-lg bg-critico p-3 font-medium text-white">
          <p>{erro}</p>
          <button type="button" onClick={aoTentarDeNovo} className="min-h-11 border border-linha rounded-lg bg-white px-3 text-asfalto">
            Tentar de novo
          </button>
        </div>
      )}

      {chamados.length === 0 ? (
        <p className="border border-dashed border-linha-forte rounded-xl p-4">Nenhum chamado por aqui.</p>
      ) : (
        <ol className="space-y-5">
          {chamados.map((chamado) => (
            <li key={chamado.id}>
              <BilheteChamado
                chamado={chamado}
                aoMudarStatus={aoMudarStatus}
                aoExcluir={aoExcluir}
                selecionado={chamado.id === selecionadoId}
                aoVerNoMapa={aoVerNoMapa}
              />
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

export default ListaChamados
