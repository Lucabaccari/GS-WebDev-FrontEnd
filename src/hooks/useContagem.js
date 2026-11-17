// Custom hook que faz um número "contar" de um valor inicial até o final (ex.: 20 °C → 45 °C).
// Só começa quando "ativo" vira true (por exemplo, quando a seção aparece na tela).
// Quem pediu "menos movimento" no sistema vê o número final direto, sem animação.
import { useState, useEffect } from 'react'

function prefereMenosMovimento() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// de: valor inicial | ate: valor final | ativo: começa a contar? | duracaoMs: tempo da animação
export function useContagem({ de = 0, ate, ativo, duracaoMs = 1600 }) {
  const [valor, setValor] = useState(de)

  useEffect(() => {
    if (!ativo) return

    let quadro
    const inicio = performance.now()
    // requestAnimationFrame chama a função a cada quadro da tela (~60 por segundo).
    function passo(agora) {
      // Sem movimento: pula direto para o fim (t = 1).
      const t = prefereMenosMovimento() ? 1 : Math.min((agora - inicio) / duracaoMs, 1)
      // "Suavização": começa rápido e desacelera no fim (fica mais natural).
      const suave = 1 - (1 - t) ** 3
      setValor(de + (ate - de) * suave)
      if (t < 1) quadro = requestAnimationFrame(passo)
    }
    quadro = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(quadro) // limpeza ao sair da tela
  }, [de, ate, ativo, duracaoMs])

  return valor
}
