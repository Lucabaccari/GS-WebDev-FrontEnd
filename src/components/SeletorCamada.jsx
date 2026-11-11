// Botões para escolher o que o mapa mostra: tudo (Geral) ou uma camada só.
// Props: valor (camada escolhida) e aoMudar (função chamada com a nova camada).
import { CAMADAS } from '../utils/classificar.js'

// "Geral" + as 4 camadas, na ordem dos botões.
const OPCOES = [
  { id: 'geral', nome: 'Geral' },
  ...Object.entries(CAMADAS).map(([id, regra]) => ({ id, nome: regra.nome })),
]

function SeletorCamada({ valor, aoMudar }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-bold uppercase">Ver no mapa</legend>
      <div className="flex flex-wrap gap-2">
        {OPCOES.map((opcao) => {
          const ativo = opcao.id === valor
          return (
            <button
              key={opcao.id}
              type="button"
              aria-pressed={ativo}
              onClick={() => aoMudar(opcao.id)}
              className={`min-h-11 border-2 border-asfalto px-3 text-sm font-bold ${
                ativo ? 'bg-asfalto text-white' : 'bg-white shadow-dura hover:bg-concreto'
              }`}
            >
              {opcao.nome}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

export default SeletorCamada
