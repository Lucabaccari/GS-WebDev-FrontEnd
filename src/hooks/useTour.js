// Hook do tour guiado (tutorial de primeira visita).
// Guarda em qual passo o tour está e se ele está aberto.
// Abre sozinho só na PRIMEIRA visita: ao terminar ou pular, grava no navegador que a
// pessoa já viu, e o tour não volta sozinho (mas pode ser aberto de novo pelo botão).
//
// Recebe: chave (nome usado no navegador), total (quantos passos o tour tem) e
// aoMudarPasso(numero), opcional: avisa a tela quando o passo muda, para ela se preparar
// (ex.: abrir uma rua ou um chamado que o passo vai mostrar).
// Devolve: aberto, passo (0 a total-1), abrir(), avancar(), voltar() e fechar().
import { useState } from 'react'
import { lerCache, salvarCache } from '../services/cache.js'

export function useTour(chave, total, aoMudarPasso) {
  // A função dentro do useState só roda na primeira vez: abre se a pessoa nunca viu o tour.
  const [aberto, setAberto] = useState(() => !lerCache(chave))
  const [passo, setPasso] = useState(0)

  // Troca o passo e avisa a tela (se ela pediu para ser avisada).
  function irPara(numero) {
    setPasso(numero)
    aoMudarPasso?.(numero)
  }

  function abrir() {
    irPara(0)
    setAberto(true)
  }

  // Fechar serve tanto para "Pular" quanto para "Concluir": nos dois casos, a pessoa já viu.
  function fechar() {
    setAberto(false)
    salvarCache(chave, true)
  }

  function avancar() {
    if (passo < total - 1) irPara(passo + 1)
    else fechar() // no último passo, "Próximo" vira "Concluir"
  }

  function voltar() {
    if (passo > 0) irPara(passo - 1)
  }

  return { aberto, passo, abrir, avancar, voltar, fechar }
}
