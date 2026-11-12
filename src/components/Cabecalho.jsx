// Topo do app: marca, frase curta, etiqueta "Dados simulados" e as abas de tela.
import Abas from './Abas.jsx'

function Cabecalho({ abas, abaAtiva, aoTrocarAba }) {
  return (
    <header className="border-b-2 border-asfalto bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Marca: linha de "pulso" âmbar num quadrado asfalto (a mesma do favicon) */}
          <svg width="36" height="36" viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" fill="#1B1C1E" />
            <polyline points="3,17 10,17 13,9 18,24 21,17 29,17" fill="none" stroke="#FFB000" strokeWidth="3" />
          </svg>
          <div>
            <h1 className="text-2xl leading-none font-black uppercase [font-stretch:75%]">Pulso</h1>
            <p className="text-xs">Ruas medidas pelos ônibus de São Paulo</p>
          </div>
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
