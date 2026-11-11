// Cartão de um trecho da linha: número, nome, fita, estado geral e as 4 leituras.
// Só mostra dados: recebe tudo pronto do hook useLeituras pela prop "trecho".
import FitaEstado from './FitaEstado.jsx'
import EtiquetaEstado from './EtiquetaEstado.jsx'
import { CAMADAS } from '../utils/classificar.js'
import { formatarValor } from '../utils/formatadores.js'

function CartaoTrecho({ trecho }) {
  return (
    <article className="border-[3px] border-asfalto bg-white shadow-dura">
      <header className="flex items-center gap-3 p-3">
        {/* Número do trecho, como o número de uma estação */}
        <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-asfalto text-xl font-black text-white">
          {trecho.id}
        </span>
        <h2 className="text-xl leading-tight font-black uppercase [font-stretch:75%]">{trecho.nome}</h2>
      </header>

      <FitaEstado estado={trecho.estadoGeral} />

      <div className="p-3">
        <EtiquetaEstado estado={trecho.estadoGeral} grande />

        {/* Lista de leituras: <dl> é a lista de "nome: valor" do HTML */}
        <dl className="mt-3 divide-y-2 divide-asfalto/15">
          {Object.keys(CAMADAS).map((camada) => (
            <div key={camada} className="flex items-center justify-between gap-2 py-1.5">
              <dt className="text-sm font-semibold">{CAMADAS[camada].nome}</dt>
              <dd className="flex items-center gap-2">
                <span className="text-sm tabular-nums">{formatarValor(camada, trecho.leituras[camada])}</span>
                <EtiquetaEstado estado={trecho.estados[camada]} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  )
}

export default CartaoTrecho
