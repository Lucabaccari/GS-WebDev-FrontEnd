// Lista de bilhetes. Cuida das situações "carregando", "erro" e "lista vazia".
// Props: chamados, carregando, erro, aoTentarDeNovo, aoMudarStatus, aoExcluir.
import BilheteChamado from './BilheteChamado.jsx'

function ListaChamados({ chamados, carregando, erro, aoTentarDeNovo, aoMudarStatus, aoExcluir }) {
  if (carregando) {
    return <p className="font-bold" role="status">Carregando chamados...</p>
  }

  return (
    <div className="space-y-4">
      {erro && (
        <div role="alert" className="flex flex-wrap items-center gap-3 border-2 border-asfalto bg-critico p-3 font-bold text-white">
          <p>{erro}</p>
          <button type="button" onClick={aoTentarDeNovo} className="min-h-11 border-2 border-asfalto bg-white px-3 text-asfalto">
            Tentar de novo
          </button>
        </div>
      )}

      {chamados.length === 0 ? (
        <p className="border-2 border-dashed border-asfalto p-4">Nenhum chamado por aqui.</p>
      ) : (
        <ul className="grid gap-5 md:grid-cols-2">
          {chamados.map((chamado) => (
            <li key={chamado.id}>
              <BilheteChamado chamado={chamado} aoMudarStatus={aoMudarStatus} aoExcluir={aoExcluir} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ListaChamados
