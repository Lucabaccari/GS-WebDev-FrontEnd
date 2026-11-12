// Tela do Cidadão: letreiro, escolha do que ver, mapa com os 6 ônibus do sensor andando,
// painel da viagem, painel da rua e o botão "Avisar problema".
// Recebe as ruas (do useLeituras), os ônibus (do useOnibus) e os chamados (do useChamados) do App.
import { useState, useEffect } from 'react'
import LetreiroLED from '../components/LetreiroLED.jsx'
import BotaoAvisar from '../components/BotaoAvisar.jsx'
import FormChamado from '../components/FormChamado.jsx'
import BilheteChamado from '../components/BilheteChamado.jsx'
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
import Legenda from '../components/Legenda.jsx'
import { LIMITES_MAPA } from '../data/ruas.js'
import { mensagemLetreiro } from '../utils/mensagens.js'
import { filtrarChamados, FILTROS_VAZIOS } from '../utils/chamados.js'
import { limitesDe } from '../utils/geo.js'
import { trajetoDaRua } from '../utils/rota.js'

const TEMPO_AVISO_MS = 5000 // quanto tempo a confirmação do aviso fica no letreiro

function Cidadao({ ruas, pontos, frota, chamados, aoCriarChamado }) {
  // Camada que o mapa e o letreiro mostram: 'geral', 'calor', 'luz', 'pavimento' ou 'ar'.
  const [camada, setCamada] = useState('geral')
  // O que o mapa mostra: 'todas' (mapa amplo com os 6 ônibus) ou o id de uma rua.
  const [visao, setVisao] = useState('todas')
  const [seguir, setSeguir] = useState(true) // a câmera acompanha o ônibus da rua?
  const [pontoId, setPontoId] = useState(null) // ponto aberto no painel, ou null
  const [formAberto, setFormAberto] = useState(false)
  const [aviso, setAviso] = useState(null) // texto temporário do letreiro, ou null

  // Depois de alguns segundos, o aviso some e o letreiro volta ao alerta normal.
  useEffect(() => {
    if (!aviso) return
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

  // Chamado pelo formulário. Devolve true/false para o formulário saber se deu certo.
  async function enviarChamado(dados) {
    const novo = await aoCriarChamado(dados)
    if (!novo) return false
    setFormAberto(false)
    setAviso('Aviso recebido. A subprefeitura vai analisar.')
    return true
  }

  // Os 3 avisos mais recentes feitos por cidadãos.
  const ultimosAvisos = filtrarChamados(
    chamados.filter((c) => c.origem === 'cidadao'),
    FILTROS_VAZIOS,
  ).slice(0, 3)

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

      {/* Controles por cima do mapa. z-[1000] fica acima das camadas do Leaflet. */}
      <div className="absolute top-3 left-3 z-[1000] max-w-[calc(100%-4.5rem)]">
        <SeletorCamada valor={camada} aoMudar={setCamada} />
      </div>

      {/* A pessoa arrastou o mapa: botão para voltar a acompanhar o ônibus */}
      {ruaFoco && !seguir && (
        <button
          type="button"
          onClick={() => setSeguir(true)}
          className="absolute top-20 right-3 z-[1000] min-h-11 border-2 border-asfalto bg-white px-3 text-sm font-bold shadow-dura"
        >
          Acompanhar ônibus
        </button>
      )}

      <div className="absolute bottom-6 left-3 z-[1000]">
        <BotaoAvisar aberto={formAberto} aoClicar={() => setFormAberto(!formAberto)} />
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <LetreiroLED
        mensagem={aviso || mensagemLetreiro(pontos, camada)}
        info={onibusDaRua ? `Ônibus: ${onibusDaRua.ruaNome} · nº ${onibusDaRua.numero}` : '6 ônibus com sensor'}
      />

      <SeletorVisao ruas={ruas} camada={camada} valor={visao} aoMudar={mudarVisao} frota={frota} />

      {ruaFoco ? (
        // Uma rua em foco: mapa à esquerda; viagem e painel da rua à direita (embaixo, no celular).
        <div className="grid border-2 border-asfalto bg-white lg:grid-cols-[minmax(0,1fr)_400px]">
          {mapa}
          <aside className="flex flex-col border-t-2 border-asfalto lg:h-[680px] lg:border-t-0 lg:border-l-2">
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
          <div className="border-2 border-asfalto bg-white">{mapa}</div>
          {formulario}
          <PainelTodas ruas={ruas} camada={camada} frota={frota} aoVerRua={mudarVisao} />
        </>
      )}

      <Legenda />

      {ultimosAvisos.length > 0 && (
        <section aria-labelledby="titulo-avisos">
          <h2 id="titulo-avisos" className="mb-3 text-2xl font-black uppercase [font-stretch:75%]">
            Últimos avisos
          </h2>
          {/* Sem aoMudarStatus/aoExcluir: o cidadão só vê o bilhete */}
          <ul className="grid gap-5 md:grid-cols-3">
            {ultimosAvisos.map((chamado) => (
              <li key={chamado.id}>
                <BilheteChamado chamado={chamado} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

export default Cidadao
