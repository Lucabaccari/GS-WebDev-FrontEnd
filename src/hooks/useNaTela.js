// Custom hook que avisa quando um elemento aparece na tela pela primeira vez (ao rolar a página).
// Usa o IntersectionObserver do navegador, que "observa" o elemento sem pesar na rolagem.
// Devolve [ref, apareceu]: coloque a ref no elemento; "apareceu" vira true e fica true.
import { useState, useEffect, useRef } from 'react'

// limite: quanto do elemento precisa aparecer (0.35 = 35%) para contar.
export function useNaTela(limite = 0.35) {
  const ref = useRef(null)
  const [apareceu, setApareceu] = useState(false)

  useEffect(() => {
    const elemento = ref.current
    if (!elemento || apareceu) return

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setApareceu(true)
          observador.disconnect() // só precisa avisar uma vez
        }
      },
      { threshold: limite },
    )
    observador.observe(elemento)
    return () => observador.disconnect() // limpeza ao sair da tela
  }, [apareceu, limite])

  return [ref, apareceu]
}
