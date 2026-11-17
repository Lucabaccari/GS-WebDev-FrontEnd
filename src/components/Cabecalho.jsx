// Topo do app: a marca e as abas (Início, Cidadão, Agente).
// tema: 'claro' (Cidadão), 'escuro' (Início, que tem o topo escuro) ou 'agente' (azul da subprefeitura).
// O topo muda de cor para deixar claro que Cidadão e Agente são duas visões diferentes.
import Abas from './Abas.jsx'
import MarcaPulso from './MarcaPulso.jsx'
import MenuCelular from './MenuCelular.jsx'

const FUNDO = {
  claro: 'border-b border-linha bg-white',
  escuro: 'bg-tinta text-white',
  agente: 'bg-agente text-white',
}

function Cabecalho({ abas, abaAtiva, aoTrocarAba, tema = 'claro' }) {
  const escuro = tema !== 'claro' // escuro e agente: texto e abas claros sobre fundo escuro
  return (
    <header className={FUNDO[tema]}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        {/* O aviso de "dados simulados" fica no conteúdo (bilhetes, tour e rodapé), não no topo. */}
        <MarcaPulso escuro={escuro} />
        {/* Computador e tablet: abas em pílula. Celular: botão de menu à direita. */}
        <div className="hidden md:block">
          <Abas abas={abas} ativa={abaAtiva} aoTrocar={aoTrocarAba} escuro={escuro} />
        </div>
        <MenuCelular abas={abas} ativa={abaAtiva} aoTrocar={aoTrocarAba} escuro={escuro} />
      </div>
    </header>
  )
}

export default Cabecalho
