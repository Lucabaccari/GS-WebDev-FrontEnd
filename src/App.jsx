// Componente raiz: guarda qual aba está aberta e mostra a tela certa.
// Os hooks ficam aqui (e não dentro das telas) para a simulação e os chamados
// continuarem funcionando mesmo quando o usuário troca de aba.
import { useState, useEffect, useRef } from 'react'
import { useLeituras } from './hooks/useLeituras.js'
import { useOnibus } from './hooks/useOnibus.js'
import { useChamados } from './hooks/useChamados.js'
import { useChamadoAutomatico } from './hooks/useChamadoAutomatico.js'
import { useOnlineStatus } from './hooks/useOnlineStatus.js'
import Cabecalho from './components/Cabecalho.jsx'
import BannerOffline from './components/BannerOffline.jsx'
import ControlesDemo from './components/ControlesDemo.jsx'
import Inicio from './pages/Inicio.jsx'
import Cidadao from './pages/Cidadao.jsx'
import Agente from './pages/Agente.jsx'
import { VELOCIDADES } from './utils/simulacao.js'

const ABAS = [
  { id: 'inicio', rotulo: 'Início' },
  { id: 'cidadao', rotulo: 'Cidadão' },
  { id: 'agente', rotulo: 'Agente' },
]

// Lê a aba do endereço (ex.: ".../#agente" abre direto a tela do Agente). Sem # válido: Início.
function abaDoEndereco() {
  const id = window.location.hash.replace('#', '')
  return ABAS.some((a) => a.id === id) ? id : 'inicio'
}

function App() {
  // A função dentro do useState só roda na primeira vez: abre a aba que está no endereço.
  const [aba, setAba] = useState(abaDoEndereco)
  const [pausado, setPausado] = useState(false) // pausa do modo demonstração
  const [velocidade, setVelocidade] = useState('1x')
  // Começa desligado: só cria chamados automáticos na API quando alguém liga (ex.: na apresentação).
  const [automaticoLigado, setAutomaticoLigado] = useState(false)
  const online = useOnlineStatus()

  // As leituras de cada ponto. Os ônibus avisam quando passam pelos pontos (registrarLeituras).
  const { ruas, pontos, contagem, registrarLeituras } = useLeituras()

  // Os 6 ônibus com sensor, um em cada rua. Sem internet, os dados não chegam:
  // eles param e a tela continua mostrando as últimas leituras.
  const fator = VELOCIDADES.find((v) => v.id === velocidade).fator
  const { onibus: frota, avancar } = useOnibus({ fator, pausado: pausado || !online, aoPassarNosPontos: registrarLeituras })

  // Os chamados também ficam aqui: as duas telas veem a mesma lista.
  const { chamados, carregando, erro, carregar, criar, mudarStatus, excluir } = useChamados()
  // Regra do 3º alerta seguido em cada ponto: confere a cada leitura nova ("contagem").
  useChamadoAutomatico({ pontos, passagem: contagem, chamados, carregando, criar, ativo: automaticoLigado })

  // Troca de tela: muda a aba, o endereço (#cidadao) e volta para o topo da página.
  function irPara(novaAba) {
    setAba(novaAba)
    window.history.replaceState(null, '', `#${novaAba}`)
    window.scrollTo({ top: 0 })
  }

  // Se a pessoa usar o "voltar" do navegador ou colar um link com #, a aba acompanha.
  useEffect(() => {
    function aoMudarEndereco() {
      // Só troca se o # for de uma tela (o link "Pular para o conteúdo" usa #conteudo e não deve trocar).
      const id = window.location.hash.replace('#', '')
      if (ABAS.some((a) => a.id === id)) setAba(id)
    }
    window.addEventListener('hashchange', aoMudarEndereco)
    return () => window.removeEventListener('hashchange', aoMudarEndereco)
  }, [])

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

      {/* O topo muda de cor em cada tela: escuro no Início, claro no Cidadão e azul no Agente. */}
      <Cabecalho abas={ABAS} abaAtiva={aba} aoTrocarAba={irPara} tema={aba === 'inicio' ? 'escuro' : aba === 'agente' ? 'agente' : 'claro'} />
      {!online && <BannerOffline />}

      {aba === 'inicio' ? (
        // O Início ocupa a largura toda (as seções têm fundo de ponta a ponta).
        <main id="conteudo" tabIndex={-1} role="tabpanel" aria-labelledby="aba-inicio">
          <Inicio frota={frota} pontos={pontos} aoIr={irPara} />
        </main>
      ) : (
        // No Agente, o fundo da página fica azul-claro (visão da subprefeitura).
        <div className={aba === 'agente' ? 'min-h-[calc(100vh-72px)] bg-agente-fundo' : ''}>
          <div className="mx-auto max-w-7xl space-y-5 p-4">
            {/* role="tabpanel" liga este conteúdo à aba selecionada (acessibilidade) */}
            <main id="conteudo" tabIndex={-1} role="tabpanel" aria-labelledby={`aba-${aba}`}>
              {aba === 'cidadao' ? (
                <Cidadao ruas={ruas} pontos={pontos} frota={frota} aoCriarChamado={criar} />
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

            {/* Modo demonstração: fica no fim da tela do Cidadão, onde os ônibus andam no mapa. */}
            {aba === 'cidadao' && (
              <ControlesDemo
                pausado={pausado}
                aoPausar={() => setPausado(!pausado)}
                aoAvancar={() => avancar(15000)}
                velocidade={velocidade}
                aoMudarVelocidade={setVelocidade}
                bloqueado={!online}
                automaticoLigado={automaticoLigado}
                aoAlternarAutomatico={() => setAutomaticoLigado(!automaticoLigado)}
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default App
