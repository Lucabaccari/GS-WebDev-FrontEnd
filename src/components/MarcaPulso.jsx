// Marca do Pulso: a linha de batimento ("pulso") em coral + o nome. A mesma do vídeo do grupo.
// Props: escuro (texto branco, para fundo escuro), grande (versão maior, usada no Início).

function MarcaPulso({ escuro = false, grande = false }) {
  const altura = grande ? 34 : 24
  return (
    <span className="inline-flex items-center gap-2">
      <svg width={altura * 1.4} height={altura} viewBox="0 0 34 24" aria-hidden="true">
        <polyline
          points="1,13 9,13 12,5 17,20 21,10 24,13 33,13"
          fill="none"
          stroke="#F0634C"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className={`font-semibold tracking-tight ${grande ? 'text-4xl' : 'text-xl'} ${escuro ? 'text-white' : 'text-tinta'}`}>
        Pulso
      </span>
    </span>
  )
}

export default MarcaPulso
