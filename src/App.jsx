// Componente raiz: guarda qual aba está aberta e mostra a tela certa.
// O useLeituras fica aqui (e não dentro da tela) para a simulação continuar
// rodando mesmo quando o usuário troca de aba.
import { useState } from 'react'
import { useLeituras } from './hooks/useLeituras.js'
import { useChamados } from './hooks/useChamados.js'
import { useChamadoAutomatico } from './hooks/useChamadoAutomatico.js'
import Cabecalho from './components/Cabecalho.jsx'
import Cidadao from './pages/Cidadao.jsx'
import Agente from './pages/Agente.jsx'

const ABAS = [
  { id: 'cidadao', rotulo: 'Cidadão' },
  { id: 'agente', rotulo: 'Agente' },
]

function App() {
  const [aba, setAba] = useState('cidadao')
  const { trechos, passagem } = useLeituras()
  // Os chamados também ficam aqui: as duas telas veem a mesma lista.
  const { chamados, carregando, erro, carregar, criar, mudarStatus, excluir } = useChamados()
  // Regra da 6ª passagem crítica: roda aqui para funcionar em qualquer aba.
  useChamadoAutomatico({ trechos, passagem, chamados, carregando, criar })

  return (
    <>
      <Cabecalho abas={ABAS} abaAtiva={aba} aoTrocarAba={setAba} />

      {/* role="tabpanel" liga este conteúdo à aba selecionada (acessibilidade) */}
      <main id={`painel-${aba}`} role="tabpanel" aria-labelledby={`aba-${aba}`} className="mx-auto max-w-6xl p-4">
        {aba === 'cidadao' ? (
          <Cidadao trechos={trechos} passagem={passagem} chamados={chamados} aoCriarChamado={criar} />
        ) : (
          <Agente
            chamados={chamados}
            carregando={carregando}
            erro={erro}
            aoRecarregar={carregar}
            aoMudarStatus={mudarStatus}
            aoExcluir={excluir}
          />
        )}
      </main>
    </>
  )
}

export default App
