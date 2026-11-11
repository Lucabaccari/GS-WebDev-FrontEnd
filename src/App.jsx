// Componente raiz: guarda qual aba está aberta e mostra a tela certa.
// O useLeituras fica aqui (e não dentro da tela) para a simulação continuar
// rodando mesmo quando o usuário troca de aba.
import { useState } from 'react'
import { useLeituras } from './hooks/useLeituras.js'
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

  return (
    <>
      <Cabecalho abas={ABAS} abaAtiva={aba} aoTrocarAba={setAba} />

      {/* role="tabpanel" liga este conteúdo à aba selecionada (acessibilidade) */}
      <main id={`painel-${aba}`} role="tabpanel" aria-labelledby={`aba-${aba}`} className="mx-auto max-w-6xl p-4">
        {aba === 'cidadao' ? <Cidadao trechos={trechos} passagem={passagem} /> : <Agente />}
      </main>
    </>
  )
}

export default App
