// Topo do app: nome, etiqueta "Dados simulados" e as abas de tela.
import Abas from './Abas.jsx'

function Cabecalho({ abas, abaAtiva, aoTrocarAba }) {
  return (
    <header className="border-b-[3px] border-asfalto bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-black uppercase [font-stretch:75%]">Pulso Web</h1>
          <span className="border-2 border-asfalto bg-atencao px-2 py-0.5 text-xs font-bold uppercase">
            Dados simulados
          </span>
        </div>
        <Abas abas={abas} ativa={abaAtiva} aoTrocar={aoTrocarAba} />
      </div>
    </header>
  )
}

export default Cabecalho
