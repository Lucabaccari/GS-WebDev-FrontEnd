// Custom hook que aplica a regra do chamado automático a cada passagem do ônibus.
// Ele não guarda nada para a tela: só olha os pontos e, se for preciso, cria o chamado.
import { useEffect, useRef } from 'react'
import { chamadosParaAbrir, montarChamadoAutomatico } from '../utils/regras.js'

// ativo: false desliga a regra (chave do modo demonstração), para quem só está olhando
// o site não criar chamados na API compartilhada.
export function useChamadoAutomatico({ pontos, passagem, chamados, carregando, criar, ativo }) {
  // useRef guarda um valor que sobrevive entre renderizações sem redesenhar a tela.
  // Aqui ele lembra a última passagem já conferida, para não criar o mesmo chamado duas vezes.
  const ultimaConferida = useRef(0)

  useEffect(() => {
    // Espera a lista da API chegar: sem ela não dá para saber se o chamado já existe.
    if (!ativo || carregando) return
    if (ultimaConferida.current === passagem) return
    ultimaConferida.current = passagem

    for (const { ponto, camada } of chamadosParaAbrir(pontos, chamados)) {
      criar(montarChamadoAutomatico(ponto, camada))
    }
  }, [passagem, pontos, chamados, carregando, criar, ativo])
}
