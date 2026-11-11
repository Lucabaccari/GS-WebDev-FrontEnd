// Custom hook que aplica a regra do chamado automático a cada passagem do ônibus.
// Ele não guarda nada para a tela: só olha os trechos e, se for preciso, cria o chamado.
import { useEffect, useRef } from 'react'
import { chamadosParaAbrir, montarChamadoAutomatico } from '../utils/regras.js'

export function useChamadoAutomatico({ trechos, passagem, chamados, carregando, criar }) {
  // useRef guarda um valor que sobrevive entre renderizações sem redesenhar a tela.
  // Aqui ele lembra a última passagem já conferida, para não criar o mesmo chamado duas vezes.
  const ultimaConferida = useRef(0)

  useEffect(() => {
    // Espera a lista da API chegar: sem ela não dá para saber se o chamado já existe.
    if (carregando) return
    if (ultimaConferida.current === passagem) return
    ultimaConferida.current = passagem

    for (const { trecho, camada } of chamadosParaAbrir(trechos, chamados)) {
      criar(montarChamadoAutomatico(trecho, camada))
    }
  }, [passagem, trechos, chamados, carregando, criar])
}
