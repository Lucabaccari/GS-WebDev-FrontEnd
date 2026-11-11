// Custom hook que simula o ônibus passando pelos trechos de tempos em tempos.
// A cada passagem gera leituras novas, conta as passagens críticas seguidas
// e já calcula o estado de cada trecho.
import { useState, useEffect } from 'react'
import { TRECHOS } from '../data/linha.js'
import { gerarPassagem } from '../utils/simulacao.js'
import { classificar, estadoMaisGrave } from '../utils/classificar.js'
import { atualizarSequencias } from '../utils/regras.js'

const CAMADAS_IDS = ['calor', 'luz', 'pavimento', 'ar']

// Junta cada trecho com suas leituras, estados e sequências. É uma conta, não um estado:
// é recalculada a partir dos dados sempre que a tela atualiza.
function montarTrechos(leituras, sequencias) {
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
      sequencias: sequencias[trecho.id], // passagens críticas seguidas por camada
      // O estado geral do trecho é o pior entre as 4 camadas.
      estadoGeral: estadoMaisGrave(Object.values(estados)),
    }
  })
}

// Dados da primeira passagem (usados só quando o app abre).
function primeiraPassagem() {
  const leituras = gerarPassagem(TRECHOS)
  return { passagem: 1, leituras, sequencias: atualizarSequencias({}, leituras, TRECHOS) }
}

// intervaloMs: tempo entre uma passagem e outra (padrão: 4 segundos).
export function useLeituras(intervaloMs = 4000) {
  // Um estado só com tudo da passagem, porque as 3 partes mudam juntas.
  // A função dentro do useState só roda na primeira vez.
  const [dados, setDados] = useState(primeiraPassagem)

  useEffect(() => {
    // setInterval repete a função a cada intervaloMs.
    const timer = setInterval(() => {
      const leituras = gerarPassagem(TRECHOS)
      // "anterior" é o estado de antes: precisamos dele para continuar a contagem.
      setDados((anterior) => ({
        passagem: anterior.passagem + 1,
        leituras,
        sequencias: atualizarSequencias(anterior.sequencias, leituras, TRECHOS),
      }))
    }, intervaloMs)

    // Limpeza: quando o componente sai da tela, para o timer.
    return () => clearInterval(timer)
  }, [intervaloMs])

  return { trechos: montarTrechos(dados.leituras, dados.sequencias), passagem: dados.passagem }
}
