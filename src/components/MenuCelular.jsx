// Menu do celular: um botão "Menu" no canto direito do topo que abre a lista das telas
// (Início, Cidadão, Agente). No computador ele some e ficam as abas (componente Abas).
// Fecha ao escolher uma tela, ao apertar Esc ou ao tocar fora do menu.
//
// Props: abas (lista de { id, rotulo }), ativa (id da tela aberta), aoTrocar(id) e escuro
// (true quando o topo é escuro ou azul).
import { useState, useEffect, useRef } from 'react'

function IconeMenu({ aberto }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      {aberto ? (
        <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  )
}

function MenuCelular({ abas, ativa, aoTrocar, escuro = false }) {
  const [aberto, setAberto] = useState(false)
  const caixaRef = useRef(null) // botão + lista: tocar fora disso fecha o menu

  // Enquanto o menu está aberto, escuta Esc e toques fora dele.
  useEffect(() => {
    if (!aberto) return
    function aoTeclar(evento) {
      if (evento.key === 'Escape') setAberto(false)
    }
    function aoTocarFora(evento) {
      if (!caixaRef.current?.contains(evento.target)) setAberto(false)
    }
    window.addEventListener('keydown', aoTeclar)
    window.addEventListener('pointerdown', aoTocarFora)
    return () => {
      window.removeEventListener('keydown', aoTeclar)
      window.removeEventListener('pointerdown', aoTocarFora)
    }
  }, [aberto])

  function escolher(id) {
    setAberto(false)
    aoTrocar(id)
  }

  const atual = abas.find((a) => a.id === ativa)

  return (
    <div ref={caixaRef} className="relative md:hidden">
      <button
        type="button"
        aria-expanded={aberto}
        aria-controls="menu-telas"
        onClick={() => setAberto(!aberto)}
        className={`flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium ${
          escuro ? 'bg-white/10 text-white' : 'bg-papel text-tinta ring-1 ring-linha'
        }`}
      >
        {/* Mostra a tela atual, para a pessoa saber onde está */}
        {atual?.rotulo}
        <IconeMenu aberto={aberto} />
        <span className="sr-only">{aberto ? 'Fechar menu' : 'Abrir menu das telas'}</span>
      </button>

      {aberto && (
        <nav
          id="menu-telas"
          aria-label="Telas do Pulso"
          className="absolute top-full right-0 z-[3000] mt-2 w-56 overflow-hidden rounded-2xl border border-linha bg-white p-2 text-tinta shadow-suave"
        >
          <ul>
            {abas.map((aba) => {
              const selecionada = aba.id === ativa
              return (
                <li key={aba.id}>
                  <button
                    type="button"
                    aria-current={selecionada ? 'page' : undefined}
                    onClick={() => escolher(aba.id)}
                    className={`flex min-h-12 w-full items-center justify-between rounded-xl px-4 text-left font-medium ${
                      selecionada ? 'bg-tinta text-white' : 'hover:bg-papel'
                    }`}
                  >
                    {aba.rotulo}
                    {selecionada && <span className="font-mono text-[11px] tracking-wider uppercase">aqui</span>}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </div>
  )
}

export default MenuCelular
