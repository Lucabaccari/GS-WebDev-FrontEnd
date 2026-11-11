// Faixa de aviso quando o aparelho fica sem internet.
// Em vez de quebrar, o app mostra as últimas leituras e chamados que já tinha.

function BannerOffline() {
  return (
    <div role="status" className="border-b-[3px] border-asfalto bg-atencao">
      <p className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 font-bold">
        {/* Pictograma: losango de atenção */}
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
          <polygon points="12,1.5 22.5,12 12,22.5 1.5,12" fill="#FFC400" stroke="#1B1C1E" strokeWidth="2" />
          <rect x="11" y="6.5" width="2" height="7" fill="#1B1C1E" />
          <rect x="11" y="15.5" width="2" height="2" fill="#1B1C1E" />
        </svg>
        Sem conexão. Mostrando as últimas leituras e chamados salvos.
      </p>
    </div>
  )
}

export default BannerOffline
