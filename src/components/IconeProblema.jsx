// Ícone do tipo de problema de um chamado, desenhado em SVG (traço fino, sem círculo atrás).
// calor = termômetro com sol | luz = poste apagado | pavimento = buraco na rua
// ar = nuvem de fumaça | outros = alfinete com "?"
// Props: tipo ('calor', 'luz', 'pavimento', 'ar' ou 'outros') e tamanho (em px).
// aria-hidden: o nome do tipo sempre aparece escrito ao lado.

function IconeProblema({ tipo, tamanho = 40 }) {
  const traco = { fill: 'none', stroke: '#15171B', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }

  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 40 40" aria-hidden="true" className="shrink-0">
      {tipo === 'calor' && (
        <>
          {/* termômetro com a coluna vermelha e um sol ao lado */}
          <path d="M13 24V8a4 4 0 0 1 8 0v16a7 7 0 1 1-8 0z" {...traco} />
          <path d="M17 12v15" stroke="#D7261E" strokeWidth="3" strokeLinecap="round" />
          <circle cx="17" cy="29" r="3.2" fill="#D7261E" />
          <circle cx="32" cy="10" r="3.5" fill="#FFB000" />
          <path d="M32 3v2M32 15v2M25 10h2M37 10h2" stroke="#FFB000" strokeWidth="1.8" strokeLinecap="round" />
        </>
      )}
      {tipo === 'luz' && (
        <>
          {/* poste com a lâmpada apagada (riscada) */}
          <path d="M12 37V8a3 3 0 0 1 3-3h10" {...traco} />
          <path d="M22 5h8l2 5H20z" {...traco} />
          <path d="M8 37h10" {...traco} />
          <path d="M21 15l10 10M31 15 21 25" stroke="#D7261E" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {tipo === 'pavimento' && (
        <>
          {/* rua com faixa e um buraco rachado */}
          <path d="M3 30h34M3 10h34" {...traco} />
          <path d="M8 20h6M26 20h6" {...traco} />
          <ellipse cx="20" cy="22" rx="7" ry="4" fill="#15171B" />
          <path d="M13 19l-3-4M27 20l4-3M19 26l-1 4" {...traco} />
        </>
      )}
      {tipo === 'ar' && (
        <>
          {/* nuvem de fumaça saindo e partículas */}
          <path d="M10 26a6 6 0 0 1 1-12 8 8 0 0 1 15-2 6 6 0 0 1 4 14z" {...traco} fill="#E2E0DA" />
          <circle cx="12" cy="33" r="1.6" fill="#4B4F58" />
          <circle cx="20" cy="35" r="1.6" fill="#4B4F58" />
          <circle cx="28" cy="32" r="1.6" fill="#4B4F58" />
        </>
      )}
      {tipo === 'outros' && (
        <>
          {/* alfinete coral com ponto de interrogação */}
          <path d="M20 37s-11-9.5-11-17a11 11 0 0 1 22 0c0 7.5-11 17-11 17z" fill="#F0634C" stroke="#15171B" strokeWidth="1.6" />
          <path d="M16.5 16a3.5 3.5 0 1 1 5 3.2c-1 .5-1.5 1.2-1.5 2.3" fill="none" stroke="#15171B" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="20" cy="25.5" r="1.2" fill="#15171B" />
        </>
      )}
    </svg>
  )
}

export default IconeProblema
