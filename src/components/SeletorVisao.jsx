// Escolha do que o mapa mostra:
// - "Todas as ruas": mapa amplo, com as 6 ruas e os 6 ônibus andando ao mesmo tempo
// - uma rua: só ela no mapa, com zoom, e a câmera acompanhando o ônibus dela
// Cada rua mostra o pior estado (pictograma), quantos lugares têm problema e onde o ônibus está.
//
// Props: ruas, camada, valor ('todas' ou o id da rua), aoMudar(valor), frota (os 6 ônibus do useOnibus).
import StatusPicto from './StatusPicto.jsx'
import { resumirRua } from '../utils/classificar.js'

// Classes do botão ativo e do normal (para não repetir).
function classeBotao(ativo) {
  return `flex min-h-11 shrink-0 items-center gap-2 border-2 px-3 text-sm font-bold whitespace-nowrap ${
    ativo ? 'border-asfalto bg-asfalto text-white' : 'border-asfalto/30 bg-white hover:border-asfalto'
  }`
}

function SeletorVisao({ ruas, camada, valor, aoMudar, frota }) {
  return (
    <nav aria-label="O que ver no mapa" className="flex gap-2 overflow-x-auto pb-1">
      <button type="button" aria-pressed={valor === 'todas'} onClick={() => aoMudar('todas')} className={classeBotao(valor === 'todas')}>
        Todas as ruas
      </button>

      <span aria-hidden="true" className="w-0.5 shrink-0 bg-asfalto/20" />

      {ruas.map((rua) => {
        const resumo = resumirRua(rua, camada)
        const problemas = resumo.critico + resumo.atencao
        const onibus = frota.find((o) => o.ruaId === rua.id)
        const ativo = valor === rua.id
        return (
          <button key={rua.id} type="button" aria-pressed={ativo} onClick={() => aoMudar(rua.id)} className={classeBotao(ativo)}>
            <StatusPicto estado={resumo.pior} tamanho={16} />
            <span className="text-left leading-tight">
              {rua.nome}
              {problemas > 0 && <span className="tabular-nums"> ({problemas})</span>}
              <span className={`block text-xs font-semibold tabular-nums ${ativo ? 'text-ambar' : ''}`}>
                {/* Resumo: o trecho de 100 m. O número exato aparece só na rua em foco. */}
                {`ônibus ${onibus.parado ? 'parado ' : ''}no ${onibus.trecho}`}
              </span>
            </span>
          </button>
        )
      })}
    </nav>
  )
}

export default SeletorVisao
