// Custom hook que move os 6 ônibus com sensor, um em cada rua, ao mesmo tempo.
// Ele guarda só o tempo da simulação; a posição de cada ônibus sai das contas de utils/rota.js.
// A cada passo, avisa quais pontos de medição os ônibus acabaram de passar
// (aoPassarNosPontos), que é a hora de o sensor ler esses pontos.
import { useState, useEffect, useRef } from 'react'
import { TRAJETOS, estadoDoOnibus, pontosPassados } from '../utils/rota.js'

const PASSO_MS = 200 // de quanto em quanto tempo a tela atualiza (5 vezes por segundo)

// Opções:
// - fator: velocidade da demonstração (1 = 3 minutos por passagem, 10 = dez vezes mais rápido)
// - pausado: true para os ônibus pararem (modo demonstração ou sem conexão)
// - aoPassarNosPontos(ids): chamada com a lista de pontos que algum ônibus acabou de passar
export function useOnibus({ fator = 1, pausado = false, aoPassarNosPontos }) {
  const [tempoMs, setTempoMs] = useState(0)

  // useRef guarda valores que mudam sem redesenhar a tela:
  const tempoRef = useRef(0) // o tempo "de verdade" (o estado acima é a cópia para a tela)
  const avisoRef = useRef(aoPassarNosPontos) // a função de aviso mais recente

  // Sempre que o componente redesenha, guarda a versão mais nova da função de aviso.
  useEffect(() => {
    avisoRef.current = aoPassarNosPontos
  })

  // Muda o tempo da simulação e avisa quais pontos os ônibus passaram nesse intervalo.
  function irPara(novoTempo) {
    const antes = tempoRef.current
    tempoRef.current = novoTempo
    const passados = TRAJETOS.flatMap((trajeto) => pontosPassados(trajeto, antes, novoTempo))
    if (passados.length > 0) avisoRef.current?.(passados)
    setTempoMs(novoTempo)
  }

  useEffect(() => {
    if (pausado) return // pausado: nenhum timer é criado

    // A cada PASSO_MS, o tempo da simulação anda PASSO_MS vezes o fator de velocidade.
    const timer = setInterval(() => irPara(tempoRef.current + PASSO_MS * fator), PASSO_MS)
    return () => clearInterval(timer) // limpeza ao pausar, mudar a velocidade ou sair da tela
  }, [fator, pausado])

  return {
    tempoMs,
    // Lista com o estado dos 6 ônibus (rua, posição, direção, parado...).
    onibus: TRAJETOS.map((trajeto) => estadoDoOnibus(trajeto, tempoMs)),
    avancar: (ms) => irPara(tempoRef.current + ms), // adianta a simulação (botão do modo demonstração)
  }
}
