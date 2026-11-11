// Tela do Cidadão: letreiro, botão "Solicitar parada", mapa da linha, legenda e os cartões dos trechos.
// Recebe os trechos (do useLeituras) e os chamados (do useChamados) prontos do App.
import { useState, useEffect } from 'react'
import LetreiroLED from '../components/LetreiroLED.jsx'
import BotaoParada from '../components/BotaoParada.jsx'
import FormChamado from '../components/FormChamado.jsx'
import BilheteChamado from '../components/BilheteChamado.jsx'
import SeletorCamada from '../components/SeletorCamada.jsx'
import MapaEsquematico from '../components/MapaEsquematico.jsx'
import Legenda from '../components/Legenda.jsx'
import CartaoTrecho from '../components/CartaoTrecho.jsx'
import { LINHA } from '../data/linha.js'
import { mensagemLetreiro } from '../utils/mensagens.js'
import { filtrarChamados, FILTROS_VAZIOS } from '../utils/chamados.js'

const TEMPO_AVISO_MS = 5000 // quanto tempo "Parada solicitada" fica no letreiro

function Cidadao({ trechos, passagem, chamados, aoCriarChamado }) {
  // Camada que o mapa e o letreiro estão mostrando: 'geral', 'calor', 'luz', 'pavimento' ou 'ar'.
  const [camada, setCamada] = useState('geral')
  const [formAberto, setFormAberto] = useState(false)
  const [aviso, setAviso] = useState(null) // texto temporário do letreiro, ou null

  // Depois de alguns segundos, o aviso some e o letreiro volta ao alerta normal.
  useEffect(() => {
    if (!aviso) return
    const timer = setTimeout(() => setAviso(null), TEMPO_AVISO_MS)
    return () => clearTimeout(timer) // limpa se o aviso mudar antes do tempo
  }, [aviso])

  // Chamado pelo formulário. Devolve true/false para o formulário saber se deu certo.
  async function enviarChamado(dados) {
    const novo = await aoCriarChamado(dados)
    if (!novo) return false
    setFormAberto(false)
    setAviso('Parada solicitada. Aviso enviado à subprefeitura.')
    return true
  }

  // Os 3 avisos mais recentes feitos por cidadãos.
  const ultimosAvisos = filtrarChamados(
    chamados.filter((c) => c.origem === 'cidadao'),
    FILTROS_VAZIOS,
  ).slice(0, 3)

  return (
    <div className="space-y-6">
      <LetreiroLED
        titulo={`${LINHA.nome} · Passagem ${passagem}`}
        mensagem={aviso || mensagemLetreiro(trechos, camada)}
      />

      <BotaoParada aberto={formAberto} aoClicar={() => setFormAberto(!formAberto)} />

      {formAberto && (
        <FormChamado trechos={trechos} aoEnviar={enviarChamado} aoCancelar={() => setFormAberto(false)} />
      )}

      <SeletorCamada valor={camada} aoMudar={setCamada} />

      {/* Celular: tudo em coluna. Telas grandes: mapa à esquerda, cartões à direita. */}
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className="space-y-4">
          <section aria-labelledby="titulo-mapa" className="border-[3px] border-asfalto bg-white p-3 shadow-dura">
            <h2 id="titulo-mapa" className="text-lg font-black uppercase [font-stretch:75%]">
              Mapa da linha
            </h2>
            <MapaEsquematico trechos={trechos} camada={camada} />
          </section>
          <Legenda />
        </div>

        <section aria-label="Detalhe dos trechos" className="grid content-start gap-5 sm:grid-cols-2">
          {trechos.map((trecho) => (
            <CartaoTrecho key={trecho.id} trecho={trecho} />
          ))}
        </section>
      </div>

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
