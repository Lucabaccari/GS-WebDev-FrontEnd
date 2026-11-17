// Topo do app: marca, etiqueta "Dados simulados" e as abas (Início, Cidadão, Agente).
// escuro = true: versão sobre fundo escuro (usada no Início, que tem o topo escuro).
import Abas from './Abas.jsx'
import MarcaPulso from './MarcaPulso.jsx'

function Cabecalho({ abas, abaAtiva, aoTrocarAba, escuro = false }) {
  return (
    <header className={escuro ? 'bg-tinta text-white' : 'border-b border-linha bg-white'}>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <MarcaPulso escuro={escuro} />
          <span
            className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] tracking-wide uppercase ${
              escuro ? 'bg-white/10 text-white/80' : 'bg-atencao/25 text-tinta'
            }`}
          >
            Dados simulados
          </span>
        </div>
        <Abas abas={abas} ativa={abaAtiva} aoTrocar={aoTrocarAba} escuro={escuro} />
      </div>
    </header>
  )
}

export default Cabecalho
