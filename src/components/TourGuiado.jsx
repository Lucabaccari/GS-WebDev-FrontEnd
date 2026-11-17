// Tour guiado: escurece a tela, destaca um elemento por vez (o "alvo" do passo)
// e mostra um cartão com a explicação e os botões Pular, Voltar e Próximo.
// O elemento destacado é achado pelo atributo data-tour (ex.: <div data-tour="mapa">).
//
// Props: passos (lista de data/tour.js), passo (número do passo atual),
// aoAvancar, aoVoltar e aoFechar (vêm do hook useTour).
import { useState, useEffect, useRef } from 'react'
import StatusPicto from './StatusPicto.jsx'

const MARGEM = 16 // distância mínima das bordas da tela (px)
const FOLGA = 6 // quanto o destaque passa da borda do elemento (px)
const ALTURA_CARTAO = 260 // altura aproximada do cartão, para decidir se ele cabe embaixo ou em cima

// Onde o cartão fica: no meio (sem alvo), no pé da tela (celular), ou embaixo/em cima do alvo.
function posicaoDoCartao(caixa) {
  const larguraTela = window.innerWidth
  const alturaTela = window.innerHeight
  const largura = Math.min(380, larguraTela - 2 * MARGEM)
  if (!caixa) return { top: '50%', left: '50%', width: largura, transform: 'translate(-50%, -50%)' }
  if (larguraTela < 640) return { left: MARGEM, right: MARGEM, bottom: MARGEM }

  // Alinha com a esquerda do alvo, sem sair da tela.
  const left = Math.min(Math.max(caixa.left, MARGEM), larguraTela - largura - MARGEM)
  if (alturaTela - caixa.bottom > ALTURA_CARTAO) return { top: caixa.bottom + MARGEM, left, width: largura }
  if (caixa.top > ALTURA_CARTAO) return { top: caixa.top - MARGEM, left, width: largura, transform: 'translateY(-100%)' }
  // Alvo grande (como o mapa): o cartão fica no canto de baixo, do lado oposto ao alvo
  // (alvo na metade direita da tela, como o painel da rua: cartão à esquerda).
  if (caixa.left > larguraTela / 2) return { bottom: MARGEM * 2, left: MARGEM * 2, width: largura }
  return { bottom: MARGEM * 2, right: MARGEM * 2, width: largura }
}

function TourGuiado({ passos, passo, aoAvancar, aoVoltar, aoFechar }) {
  const atual = passos[passo]
  const ultimo = passo === passos.length - 1
  const [caixa, setCaixa] = useState(null) // retângulo do alvo na tela, ou null
  const cartaoRef = useRef(null)

  // A cada passo: rola a página até o alvo e mede onde ele ficou.
  // Mede de novo quando a página rola ou a janela muda de tamanho.
  useEffect(() => {
    // Pode haver mais de um elemento com a mesma marca (ex.: as camadas têm uma versão para o celular
    // e outra para o computador): usa o que está visível agora (o escondido mede 0 de largura).
    const alvo = atual.alvo
      ? [...document.querySelectorAll(`[data-tour="${atual.alvo}"]`)].find((el) => el.getBoundingClientRect().width > 0) || null
      : null
    // Rola direto (sem animação): o destaque já desliza até o lugar novo.
    // Elemento alto (mapa, resumo; quase metade da tela ou mais): mostra o começo dele, e o cartão
    // fica embaixo. Elemento baixo: deixa no meio da tela.
    if (alvo) {
      const alto = alvo.getBoundingClientRect().height > window.innerHeight * 0.45
      alvo.scrollIntoView({ block: alto ? 'start' : 'center' })
    }

    function medir() {
      setCaixa(alvo ? alvo.getBoundingClientRect() : null)
    }
    const espera = setTimeout(medir, 0) // mede logo depois de rolar
    window.addEventListener('scroll', medir, true) // true: pega a rolagem de qualquer parte da página
    window.addEventListener('resize', medir)
    return () => {
      clearTimeout(espera)
      window.removeEventListener('scroll', medir, true)
      window.removeEventListener('resize', medir)
    }
  }, [atual.alvo])

  // Leva o foco do teclado para o cartão a cada passo (o leitor de tela lê o texto novo).
  useEffect(() => {
    cartaoRef.current?.focus()
  }, [passo])

  // Esc pula o tour.
  useEffect(() => {
    function aoTeclar(evento) {
      if (evento.key === 'Escape') aoFechar()
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [aoFechar])

  // O destaque não passa das bordas da tela (o mapa, por exemplo, é mais alto que a tela).
  const destaque = caixa && {
    top: Math.max(caixa.top - FOLGA, 8),
    left: Math.max(caixa.left - FOLGA, 8),
    width: Math.min(caixa.width + 2 * FOLGA, window.innerWidth - 16),
    height: Math.min(caixa.bottom + FOLGA, window.innerHeight - 8) - Math.max(caixa.top - FOLGA, 8),
  }

  return (
    <>
      {/* Camada invisível por cima da página: enquanto o tour está aberto, a página não recebe cliques. */}
      <div className="fixed inset-0 z-[2000]" aria-hidden="true" />

      {destaque ? (
        // O "furo" iluminado: uma moldura coral com uma sombra enorme que escurece o resto da tela.
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-[2001] rounded-2xl outline-2 outline-coral transition-all duration-300"
          style={{ ...destaque, boxShadow: '0 0 0 9999px rgb(21 23 27 / 0.65)' }}
        />
      ) : (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[2001] bg-tinta/65" />
      )}

      <div
        ref={cartaoRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-titulo"
        aria-describedby="tour-texto"
        tabIndex={-1}
        className="fixed z-[2002] max-w-[380px] rounded-2xl bg-white p-5 shadow-suave outline-none max-sm:max-w-none"
        style={posicaoDoCartao(caixa)}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[11px] tracking-[0.18em] text-[#B8402D] uppercase">
            Passo {passo + 1} de {passos.length}
          </p>
          {/* Bolinhas do progresso */}
          <ol className="flex gap-1.5" aria-hidden="true">
            {passos.map((p, i) => (
              <li key={p.titulo} className={`h-1.5 rounded-full ${i === passo ? 'w-5 bg-tinta' : i < passo ? 'w-1.5 bg-tinta' : 'w-1.5 bg-linha-forte'}`} />
            ))}
          </ol>
        </div>

        <h2 id="tour-titulo" className="mt-2 text-xl font-semibold tracking-tight">
          {atual.titulo}
        </h2>
        <p id="tour-texto" className="mt-1 text-sm text-tinta-2">
          {atual.texto}
        </p>

        {/* Os 3 estados, com forma e nome (no lugar da antiga legenda do mapa) */}
        {atual.estados && (
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <li className="flex items-center gap-1.5"><StatusPicto estado="normal" tamanho={18} /> Normal</li>
            <li className="flex items-center gap-1.5"><StatusPicto estado="atencao" tamanho={18} /> Atenção</li>
            <li className="flex items-center gap-1.5"><StatusPicto estado="critico" tamanho={18} /> Crítico</li>
          </ul>
        )}

        <div className="mt-5 flex items-center justify-between gap-2">
          <button type="button" onClick={aoFechar} className="min-h-11 px-1 text-sm font-medium text-tinta-2 underline underline-offset-2 hover:text-tinta">
            Pular tour
          </button>
          <div className="flex gap-2">
            {passo > 0 && (
              <button type="button" onClick={aoVoltar} className="min-h-11 rounded-full border border-linha-forte px-4 text-sm font-medium hover:border-tinta">
                Voltar
              </button>
            )}
            <button type="button" onClick={aoAvancar} className="min-h-11 rounded-full bg-tinta px-5 text-sm font-medium text-white hover:bg-black">
              {ultimo ? 'Concluir' : 'Próximo'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default TourGuiado
