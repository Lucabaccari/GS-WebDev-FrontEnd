// Topo do app: marca, etiqueta "Dados simulados" e as abas (Início, Cidadão, Agente).
// tema: 'claro' (Cidadão), 'escuro' (Início, que tem o topo escuro) ou 'agente' (azul da subprefeitura).
// O topo muda de cor para deixar claro que Cidadão e Agente são duas visões diferentes.
import Abas from './Abas.jsx'
import MarcaPulso from './MarcaPulso.jsx'

const FUNDO = {
  claro: 'border-b border-linha bg-white',
  escuro: 'bg-tinta text-white',
  agente: 'bg-agente text-white',
}

function Cabecalho({ abas, abaAtiva, aoTrocarAba, tema = 'claro' }) {
  const escuro = tema !== 'claro' // escuro e agente: texto e abas claros sobre fundo escuro
  return (
    <header className={FUNDO[tema]}>
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
