// Escolha do que o mapa mostra:
// - "Todas as ruas": mapa amplo, com as 6 ruas e os 6 ônibus andando ao mesmo tempo
// - uma rua: só ela no mapa, com zoom, e a câmera acompanhando o ônibus dela
// Cada rua mostra o pior estado (pictograma), quantos lugares têm problema e o intervalo
// de números onde o ônibus está agora.
// Os botões ficam numa grade fixa (sem rolar para o lado): 2 colunas no celular, 4 no tablet e 7 no computador.
//
// Props: ruas, camada, valor ('todas' ou o id da rua), aoMudar(valor), frota (os 6 ônibus do useOnibus).
import StatusPicto from './StatusPicto.jsx'
import { resumirRua } from '../utils/classificar.js'

// Classes do botão ativo e do normal (para não repetir).
function classeBotao(ativo) {
  return `flex h-full min-h-11 w-full items-center gap-2 rounded-xl border px-3 py-1.5 text-left text-sm font-medium transition-colors ${
    ativo ? 'border-tinta bg-tinta text-white' : 'border-linha bg-white hover:border-linha-forte'
  }`
}

function SeletorVisao({ ruas, camada, valor, aoMudar, frota }) {
  return (
    <nav aria-label="O que ver no mapa">
      {/* auto-rows-fr: todas as linhas da grade com a mesma altura (a da opção mais alta) */}
      <ul className="grid auto-rows-fr grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        <li>
          <button type="button" aria-pressed={valor === 'todas'} onClick={() => aoMudar('todas')} className={classeBotao(valor === 'todas')}>
            Todas as ruas
          </button>
        </li>

        {ruas.map((rua) => {
          const resumo = resumirRua(rua, camada)
          const problemas = resumo.critico + resumo.atencao
          const onibus = frota.find((o) => o.ruaId === rua.id)
          const ativo = valor === rua.id
          return (
            <li key={rua.id}>
              <button type="button" aria-pressed={ativo} onClick={() => aoMudar(rua.id)} className={classeBotao(ativo)}>
                <StatusPicto estado={resumo.pior} tamanho={16} />
                <span className="min-w-0 leading-tight">
                  {rua.nome}
                  {problemas > 0 && <span className="tabular-nums"> ({problemas})</span>}
                  {/* Só o intervalo de números onde o ônibus está (ex.: "nº 1201 a 1300") */}
                  <span className={`block font-mono text-[11px] font-normal tabular-nums ${ativo ? 'text-ambar' : 'text-tinta-2'}`}>
                    <span className="sr-only">Ônibus no </span>
                    {onibus.trecho}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default SeletorVisao
