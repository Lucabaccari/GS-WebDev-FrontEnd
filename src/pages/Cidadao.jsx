// Tela do Cidadão: letreiro, escolha de camada, mapa da linha, legenda e os cartões dos trechos.
// Recebe os trechos prontos do App (que usa o hook useLeituras).
import { useState } from 'react'
import LetreiroLED from '../components/LetreiroLED.jsx'
import SeletorCamada from '../components/SeletorCamada.jsx'
import MapaEsquematico from '../components/MapaEsquematico.jsx'
import Legenda from '../components/Legenda.jsx'
import CartaoTrecho from '../components/CartaoTrecho.jsx'
import { LINHA } from '../data/linha.js'
import { mensagemLetreiro } from '../utils/mensagens.js'

function Cidadao({ trechos, passagem }) {
  // Camada que o mapa e o letreiro estão mostrando: 'geral', 'calor', 'luz', 'pavimento' ou 'ar'.
  const [camada, setCamada] = useState('geral')

  return (
    <div className="space-y-6">
      <LetreiroLED
        titulo={`${LINHA.nome} · Passagem ${passagem}`}
        mensagem={mensagemLetreiro(trechos, camada)}
      />

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
    </div>
  )
}

export default Cidadao
