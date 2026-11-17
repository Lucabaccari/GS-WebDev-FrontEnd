// Ícones dos dois perfis do Pulso, desenhados em SVG (traço fino, sem círculo atrás, como pede o guia).
// - cidadao: uma pessoa segurando o celular, com o alfinete de "problema aqui" na tela
// - agente: um prédio público (subprefeitura) com uma prancheta de chamados
// Props: tipo ('cidadao' ou 'agente'), tamanho (em px), cor (do traço) e fundo (dentro do celular e da prancheta).
// cor e fundo mudam para o ícone aparecer bem em cartões coloridos ou escuros.

function IconePerfil({ tipo, tamanho = 56, cor = '#15171B', fundo = '#FFFFFF' }) {
  const traco = { fill: 'none', stroke: cor, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }

  if (tipo === 'cidadao') {
    return (
      <svg width={tamanho} height={tamanho} viewBox="0 0 56 56" aria-hidden="true">
        {/* cabeça e corpo */}
        <circle cx="22" cy="13" r="6" {...traco} />
        <path d="M10 50V36c0-7 5-12 12-12s12 5 12 12v14" {...traco} />
        {/* celular na mão */}
        <rect x="32" y="22" width="16" height="26" rx="3" {...traco} fill={fundo} />
        {/* alfinete coral na tela */}
        <path d="M40 41s-5-4.6-5-8a5 5 0 0 1 10 0c0 3.4-5 8-5 8z" fill="#F0634C" />
        <circle cx="40" cy="33" r="1.6" fill={fundo} />
      </svg>
    )
  }

  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 56 56" aria-hidden="true">
      {/* prédio público: frontão, colunas e base */}
      <path d="M6 22 24 10l18 12" {...traco} />
      <path d="M8 22h32M10 22v18M17 22v18M24 22v18M31 22v18M38 22v18M6 40h36M4 46h40" {...traco} />
      {/* prancheta com a lista de chamados */}
      <rect x="34" y="26" width="18" height="24" rx="2.5" {...traco} fill={fundo} />
      <path d="M39 26v-2h8v2" {...traco} />
      <rect x="37.5" y="31.5" width="3" height="3" rx="0.5" fill="#D7261E" />
      <path d="M43 33h6M43 39h6M43 45h6" {...traco} />
      <rect x="37.5" y="37.5" width="3" height="3" rx="0.5" fill="#FFC400" />
      <rect x="37.5" y="43.5" width="3" height="3" rx="0.5" fill="#17753F" />
    </svg>
  )
}

export default IconePerfil
