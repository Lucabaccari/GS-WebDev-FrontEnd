// Botões para escolher o que o mapa mostra: tudo (Geral) ou uma camada só.
// Ficam por cima do mapa, num grupo compacto.
// Props: valor (camada escolhida) e aoMudar (função chamada com a nova camada).
import { CAMADAS } from '../utils/classificar.js'

// "Geral" + as 4 camadas, na ordem dos botões.
const OPCOES = [
  { id: 'geral', nome: 'Geral' },
  ...Object.entries(CAMADAS).map(([id, regra]) => ({ id, nome: regra.nome })),
]

function SeletorCamada({ valor, aoMudar }) {
  return (
    // No celular os botões ficam numa linha só, que rola para o lado (não cobre o mapa).
    <div
      role="group"
      aria-label="O que mostrar no mapa"
      className="flex overflow-x-auto border-2 border-asfalto bg-white shadow-dura"
    >
      {OPCOES.map((opcao) => {
        const ativo = opcao.id === valor
        return (
          <button
            key={opcao.id}
            type="button"
            aria-pressed={ativo}
            onClick={() => aoMudar(opcao.id)}
            className={`min-h-11 shrink-0 px-3 text-sm font-bold whitespace-nowrap ${ativo ? 'bg-asfalto text-white' : 'hover:bg-concreto'}`}
          >
            {opcao.nome}
          </button>
        )
      })}
    </div>
  )
}

export default SeletorCamada
