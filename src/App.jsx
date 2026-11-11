// Componente raiz: guarda qual aba está aberta e mostra a tela certa.
// Os hooks ficam aqui (e não dentro das telas) para a simulação e os chamados
// continuarem funcionando mesmo quando o usuário troca de aba.
import { useState, useEffect, useRef } from 'react'
import { useLeituras } from './hooks/useLeituras.js'
import { useChamados } from './hooks/useChamados.js'
import { useChamadoAutomatico } from './hooks/useChamadoAutomatico.js'
import { useOnlineStatus } from './hooks/useOnlineStatus.js'
import Cabecalho from './components/Cabecalho.jsx'
import BannerOffline from './components/BannerOffline.jsx'
import ControlesDemo from './components/ControlesDemo.jsx'
import Cidadao from './pages/Cidadao.jsx'
import Agente from './pages/Agente.jsx'
import { VELOCIDADES } from './utils/simulacao.js'

const ABAS = [
  { id: 'cidadao', rotulo: 'Cidadão' },
  { id: 'agente', rotulo: 'Agente' },
]

function App() {
  const [aba, setAba] = useState('cidadao')
  const [pausado, setPausado] = useState(false) // pausa do modo demonstração
  const [velocidade, setVelocidade] = useState('normal')
  // Começa desligado: só cria chamados automáticos na API quando alguém liga (ex.: na apresentação).
  const [automaticoLigado, setAutomaticoLigado] = useState(false)
  const online = useOnlineStatus()

  // Sem internet, os sensores não mandam dados: a simulação para e a tela
  // continua mostrando as últimas leituras.
  const intervaloMs = VELOCIDADES.find((v) => v.id === velocidade).intervaloMs
  const { trechos, passagem, avancar } = useLeituras({ intervaloMs, pausado: pausado || !online })

  // Os chamados também ficam aqui: as duas telas veem a mesma lista.
  const { chamados, carregando, erro, carregar, criar, mudarStatus, excluir } = useChamados()
  // Regra da 6ª passagem crítica: roda aqui para funcionar em qualquer aba.
  useChamadoAutomatico({ trechos, passagem, chamados, carregando, criar, ativo: automaticoLigado })

  // Quando a internet volta, busca os chamados de novo na API.
  const estavaOffline = useRef(false)
  useEffect(() => {
    if (!online) {
      estavaOffline.current = true
    } else if (estavaOffline.current) {
      estavaOffline.current = false
      carregar()
    }
  }, [online, carregar])

  return (
    <>
      {/* Link escondido que aparece ao apertar Tab: pula direto para o conteúdo */}
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-10 focus:bg-white focus:p-3 focus:font-bold"
      >
        Pular para o conteúdo
      </a>

      <Cabecalho abas={ABAS} abaAtiva={aba} aoTrocarAba={setAba} />
      {!online && <BannerOffline />}

      <div className="mx-auto max-w-6xl space-y-6 p-4">
        <ControlesDemo
          pausado={pausado}
          aoPausar={() => setPausado(!pausado)}
          aoAvancar={avancar}
          velocidade={velocidade}
          aoMudarVelocidade={setVelocidade}
          bloqueado={!online}
          automaticoLigado={automaticoLigado}
          aoAlternarAutomatico={() => setAutomaticoLigado(!automaticoLigado)}
        />

        {/* role="tabpanel" liga este conteúdo à aba selecionada (acessibilidade) */}
        <main id="conteudo" tabIndex={-1} role="tabpanel" aria-labelledby={`aba-${aba}`}>
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
      </div>
    </>
  )
}

export default App
