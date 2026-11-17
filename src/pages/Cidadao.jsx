// Tela do Cidadão: escolha do que ver, mapa com os 6 ônibus do sensor andando,
// painel da viagem, painel da rua e o botão "Avisar problema".
// Na primeira visita, abre um tour guiado de 6 passos (pode pular; o botão "Como usar" abre de novo).
// Recebe as ruas e os pontos (do useLeituras), os ônibus (do useOnibus) e aoCriarChamado (do useChamados) do App.
import { useState, useEffect, useRef } from 'react'
import LetreiroLED from '../components/LetreiroLED.jsx'
import BotaoAvisar from '../components/BotaoAvisar.jsx'
import FormChamado from '../components/FormChamado.jsx'
import SeletorCamada from '../components/SeletorCamada.jsx'
import SeletorVisao from '../components/SeletorVisao.jsx'
import MapaBase from '../components/MapaBase.jsx'
import CamadaPontos from '../components/CamadaPontos.jsx'
import CamadaParadas from '../components/CamadaParadas.jsx'
import CamadaRastro from '../components/CamadaRastro.jsx'
import CameraDoMapa from '../components/CameraDoMapa.jsx'
import OnibusMarcador from '../components/OnibusMarcador.jsx'
import PainelViagem from '../components/PainelViagem.jsx'
import PainelRua from '../components/PainelRua.jsx'
import PainelTodas from '../components/PainelTodas.jsx'
import TourGuiado from '../components/TourGuiado.jsx'
import { useTour } from '../hooks/useTour.js'
import { PASSOS_TOUR_CIDADAO } from '../data/tour.js'
import { LIMITES_MAPA } from '../data/ruas.js'
import { limitesDe } from '../utils/geo.js'
import { trajetoDaRua } from '../utils/rota.js'

const TEMPO_AVISO_MS = 5000 // quanto tempo a confirmação do aviso fica na tela

function Cidadao({ ruas, pontos, frota, aoCriarChamado }) {
  // Camada que o mapa e o letreiro mostram: 'geral', 'calor', 'luz', 'pavimento' ou 'ar'.
  const [camada, setCamada] = useState('geral')
  // O que o mapa mostra: 'todas' (mapa amplo com os 6 ônibus) ou o id de uma rua.
  const [visao, setVisao] = useState('todas')
  const [seguir, setSeguir] = useState(true) // a câmera acompanha o ônibus da rua?
  const [pontoId, setPontoId] = useState(null) // ponto aberto no painel, ou null
  const [formAberto, setFormAberto] = useState(false)
  const [aviso, setAviso] = useState(null) // texto temporário do letreiro, ou null
  const avisoRef = useRef(null) // o letreiro do aviso, para a tela rolar até ele
  // Tour da primeira visita (o navegador lembra se a pessoa já viu).
  const tour = useTour('pulso-tour-cidadao', PASSOS_TOUR_CIDADAO.length)

  // Quando o aviso aparece, a tela rola até ele (o formulário pode estar lá embaixo).
  // Depois de alguns segundos, o aviso (e o letreiro com ele) some.
  useEffect(() => {
    if (!aviso) return
    avisoRef.current?.scrollIntoView({ block: 'center' })
    const timer = setTimeout(() => setAviso(null), TEMPO_AVISO_MS)
    return () => clearTimeout(timer) // limpa se o aviso mudar antes do tempo
  }, [aviso])

  // Contas da visão atual.
  const ruaFoco = visao === 'todas' ? null : ruas.find((r) => r.id === visao)
  const ruasNoMapa = ruaFoco ? [ruaFoco] : ruas // as outras ruas somem quando uma está em foco
  const onibusNoMapa = ruaFoco ? frota.filter((o) => o.ruaId === ruaFoco.id) : frota
  const onibusDaRua = ruaFoco ? onibusNoMapa[0] : null
  const seguindo = Boolean(ruaFoco) && seguir

  // Pontos onde algum ônibus está agora (o sensor está medindo ali): ganham moldura âmbar.
  const pontosLendo = onibusNoMapa
    .map((o) => pontos.find((p) => p.ruaId === o.ruaId && o.numero > p.inicioM && o.numero <= p.fimM))
    .filter(Boolean)
    .map((p) => p.id)

  function mudarVisao(nova) {
    setVisao(nova)
    setSeguir(true)
    setPontoId(null)
    setFormAberto(false)
  }

  // Clicar num ponto (no mapa ou no painel) abre o detalhe dele. Clicar de novo fecha.
  function selecionarPonto(ponto) {
    if (!ruaFoco || ruaFoco.id !== ponto.ruaId) setVisao(ponto.ruaId) // na visão "todas", vai para a rua
    setPontoId(ponto.id === pontoId ? null : ponto.id)
    setFormAberto(false)
  }

  // "Avisar problema aqui" abre o formulário já com o ponto escolhido.
  function avisarNoPonto(ponto) {
    setPontoId(ponto.id)
    setFormAberto(true)
  }

  // "Como usar": volta para "Todas as ruas" (onde estão todos os elementos do tour) e abre o tour.
  function abrirTour() {
    mudarVisao('todas')
    tour.abrir()
  }

  // Chamado pelo formulário. Devolve true/false para o formulário saber se deu certo.
  async function enviarChamado(dados) {
    const novo = await aoCriarChamado(dados)
    if (!novo) return false
    setFormAberto(false)
    setAviso('Aviso recebido. A subprefeitura vai analisar.')
    return true
  }

  // O formulário aparece no lugar do painel da rua (ou embaixo do mapa, na visão "todas").
  const formulario = formAberto && (
    // key: quando o ponto muda, o formulário recomeça com o ponto novo
    <FormChamado
      key={pontoId || 'sem-ponto'}
      ruas={ruas}
      pontoInicialId={pontoId || ''}
      aoEnviar={enviarChamado}
      aoCancelar={() => setFormAberto(false)}
    />
  )

  const mapa = (
    <div className={`relative ${ruaFoco ? 'h-[58vh] min-h-[380px] lg:h-[680px]' : 'h-[70vh] min-h-[420px] lg:h-[740px]'}`}>
      <MapaBase
        ruas={ruasNoMapa}
        aoSelecionarRua={(id) => mudarVisao(id)}
        enquadrarSozinho={false}
        rotulo="Mapa das ruas com as ocorrências e os ônibus do sensor"
      >
        <CameraDoMapa
          chaveVisao={visao}
          limites={ruaFoco ? limitesDe(ruaFoco.caminho) : LIMITES_MAPA}
          seguir={seguindo}
          alvo={onibusDaRua?.posicao}
          aoArrastar={() => setSeguir(false)}
        />
        {onibusNoMapa.map((o) => (
          <CamadaRastro key={o.ruaId} caminho={o.caminho} rastro={o.rastro} />
        ))}
        {ruaFoco && <CamadaParadas trajeto={trajetoDaRua(ruaFoco.id)} />}
        <CamadaPontos
          ruas={ruasNoMapa}
          camada={camada}
          pontoSelecionadoId={pontoId}
          pontosLendo={ruaFoco ? pontosLendo : []}
          mostrarNormais={Boolean(ruaFoco)} // no mapa amplo, só os lugares com problema
          aoSelecionarPonto={selecionarPonto}
        />
        {onibusNoMapa.map((o) => (
          <OnibusMarcador
            key={o.ruaId}
            posicao={o.posicao}
            rumo={o.rumo}
            parado={o.parado}
            titulo={`Ônibus da ${o.ruaNome}`}
            pequeno={!ruaFoco}
            // Balão só na rua em foco (no mapa amplo, 6 balões ficariam bagunçados)
            texto={ruaFoco ? `${o.parado ? 'Parado' : 'Medindo'} · nº ${o.numero}` : null}
          />
        ))}
      </MapaBase>

      {/* Controles por cima do mapa. z-[1000] fica acima das camadas do Leaflet.
          data-tour: marca o elemento que o tour guiado destaca. */}
      <div data-tour="camadas" className="absolute top-3 left-3 z-[1000] max-w-[calc(100%-4.5rem)]">
        <SeletorCamada valor={camada} aoMudar={setCamada} />
      </div>

      {/* A pessoa arrastou o mapa: botão para voltar a acompanhar o ônibus */}
      {ruaFoco && !seguir && (
        <button
          type="button"
          onClick={() => setSeguir(true)}
          className="absolute top-20 right-3 z-[1000] min-h-11 border border-linha rounded-lg bg-white px-3 text-sm font-medium shadow-suave"
        >
          Acompanhar ônibus
        </button>
      )}

      <div data-tour="avisar" className="absolute bottom-6 left-3 z-[1000]">
        <BotaoAvisar aberto={formAberto} aoClicar={() => setFormAberto(!formAberto)} />
      </div>

      {/* Abre o tour de novo (acima do crédito do mapa, no canto de baixo à direita) */}
      <button
        type="button"
        onClick={abrirTour}
        className="absolute right-3 bottom-8 z-[1000] flex min-h-11 items-center gap-2 rounded-full border border-linha bg-white px-4 text-sm font-medium shadow-suave hover:border-tinta"
      >
        <span aria-hidden="true" className="flex h-5 w-5 items-center justify-center rounded-full border border-tinta font-mono text-xs">?</span>
        Como usar
      </button>
    </div>
  )

  return (
    <div className="space-y-4">
      {/* O letreiro só aparece por alguns segundos, para confirmar que o aviso foi recebido. */}
      {aviso && (
        <div ref={avisoRef}>
          <LetreiroLED mensagem={aviso} estado="normal" />
        </div>
      )}

      <div data-tour="ruas">
        <SeletorVisao ruas={ruas} camada={camada} valor={visao} aoMudar={mudarVisao} frota={frota} />
      </div>

      {ruaFoco ? (
        // Uma rua em foco: mapa à esquerda; viagem e painel da rua à direita (embaixo, no celular).
        <div className="grid overflow-hidden rounded-2xl border border-linha bg-white shadow-suave lg:grid-cols-[minmax(0,1fr)_400px]">
          {mapa}
          <aside className="flex flex-col border-t border-linha lg:h-[680px] lg:border-t-0 lg:border-l">
            <PainelViagem onibus={onibusDaRua} trajeto={trajetoDaRua(ruaFoco.id)} />
            <div className="flex-1 p-4 lg:overflow-y-auto">
              {formulario || (
                <PainelRua
                  rua={ruaFoco}
                  camada={camada}
                  pontoSelecionadoId={pontoId}
                  aoSelecionarPonto={selecionarPonto}
                  aoAvisar={avisarNoPonto}
                  onibus={onibusDaRua}
                />
              )}
            </div>
          </aside>
        </div>
      ) : (
        // Todas as ruas: mapa amplo, ocupando a largura toda; resumo das ruas embaixo.
        <>
          <div data-tour="mapa" className="overflow-hidden rounded-2xl border border-linha bg-white shadow-suave">
            {mapa}
          </div>
          {formulario}
          <div data-tour="resumo">
            <PainelTodas ruas={ruas} camada={camada} frota={frota} aoVerRua={mudarVisao} />
          </div>
        </>
      )}

      {tour.aberto && (
        <TourGuiado
          passos={PASSOS_TOUR_CIDADAO}
          passo={tour.passo}
          aoAvancar={tour.avancar}
          aoVoltar={tour.voltar}
          aoFechar={tour.fechar}
        />
      )}
    </div>
  )
}

export default Cidadao
