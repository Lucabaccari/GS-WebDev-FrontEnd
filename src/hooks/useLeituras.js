// Custom hook que simula o ônibus passando pelos trechos de tempos em tempos.
// A cada passagem gera leituras novas e já calcula o estado de cada trecho.
import { useState, useEffect } from 'react'
import { TRECHOS } from '../data/linha.js'
import { gerarPassagem } from '../utils/simulacao.js'
import { classificar, estadoMaisGrave } from '../utils/classificar.js'

const CAMADAS_IDS = ['calor', 'luz', 'pavimento', 'ar']

// Junta cada trecho com suas leituras e estados. É uma conta, não um estado:
// é recalculada a partir das leituras sempre que a tela atualiza.
function montarTrechos(leituras) {
  return TRECHOS.map((trecho) => {
    const valores = leituras[trecho.id]
    const estados = {}
    for (const camada of CAMADAS_IDS) {
      estados[camada] = classificar(camada, valores[camada])
    }
    return {
      ...trecho,
      leituras: valores,
      estados,
      // O estado geral do trecho é o pior entre as 4 camadas.
      estadoGeral: estadoMaisGrave(Object.values(estados)),
    }
  })
}

// intervaloMs: tempo entre uma passagem e outra (padrão: 4 segundos).
export function useLeituras(intervaloMs = 4000) {
  // A função dentro do useState só roda na primeira vez: gera a 1ª passagem.
  const [leituras, setLeituras] = useState(() => gerarPassagem(TRECHOS))
  const [passagem, setPassagem] = useState(1) // número da passagem atual

  useEffect(() => {
    // setInterval repete a função a cada intervaloMs.
    const timer = setInterval(() => {
      setLeituras(gerarPassagem(TRECHOS))
      setPassagem((n) => n + 1)
    }, intervaloMs)

    // Limpeza: quando o componente sai da tela, para o timer.
    return () => clearInterval(timer)
  }, [intervaloMs])

  return { trechos: montarTrechos(leituras), passagem }
}
