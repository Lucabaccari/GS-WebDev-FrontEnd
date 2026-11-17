// Botões para escolher o que o mapa mostra: tudo (Geral) ou uma camada só.
// Props: valor (camada escolhida), aoMudar (função chamada com a nova camada) e
// grade (true = as 5 opções dividem a largura toda, sem rolar; usado no celular, fora do mapa).
// Sem "grade", é um grupo compacto que fica por cima do mapa (tablet e computador).
import { CAMADAS } from '../utils/classificar.js'

// "Geral" + as 4 camadas, na ordem dos botões.
const OPCOES = [
  { id: 'geral', nome: 'Geral' },
  ...Object.entries(CAMADAS).map(([id, regra]) => ({ id, nome: regra.nome })),
]

function SeletorCamada({ valor, aoMudar, grade = false }) {
  return (
    <div
      role="group"
      aria-label="O que mostrar no mapa"
      className={`overflow-hidden rounded-lg border border-linha bg-white shadow-suave ${grade ? 'grid grid-cols-5' : 'flex'}`}
    >
      {OPCOES.map((opcao) => {
        const ativo = opcao.id === valor
        return (
          <button
            key={opcao.id}
            type="button"
            aria-pressed={ativo}
            onClick={() => aoMudar(opcao.id)}
            // Na grade, a fonte é menor e o nome pode quebrar em 2 linhas ("Luz à / noite").
            className={`min-h-11 font-medium ${grade ? 'px-1 text-xs leading-tight' : 'shrink-0 px-3 text-sm whitespace-nowrap'} ${
              ativo ? 'bg-asfalto text-white' : 'hover:bg-concreto'
            }`}
          >
            {opcao.nome}
          </button>
        )
      })}
    </div>
  )
}

export default SeletorCamada
