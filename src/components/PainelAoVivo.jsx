// Painel "ao vivo" do Início: mostra a simulação rodando agora (os 6 ônibus e as ocorrências).
// É o mesmo dado das telas do Cidadão e do Agente, só que resumido.
// Props: frota (os 6 ônibus do useOnibus), pontos (todos os pontos do useLeituras).
import StatusPicto from './StatusPicto.jsx'
import { CAMADAS, ROTULOS_ESTADO } from '../utils/classificar.js'

// Lista as ocorrências (atenção ou crítico) de todas as ruas, as críticas primeiro.
function listarOcorrencias(pontos) {
  const lista = []
  for (const ponto of pontos) {
    for (const camada of Object.keys(CAMADAS)) {
      const estado = ponto.estados[camada]
      if (estado === 'critico' || estado === 'atencao') {
        lista.push({ id: `${ponto.id}-${camada}`, estado, camada, rua: ponto.ruaNome, local: ponto.locais[camada].nome })
      }
    }
  }
  return lista.sort((a, b) => (a.estado === b.estado ? 0 : a.estado === 'critico' ? -1 : 1))
}

function PainelAoVivo({ frota, pontos }) {
  const ocorrencias = listarOcorrencias(pontos)

  return (
    <section aria-label="Simulação ao vivo" className="rounded-2xl border border-white/10 bg-[#1E2126] p-5">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 font-mono text-[11px] tracking-wider text-white/70 uppercase">
          <span aria-hidden="true" className="ponto-ao-vivo h-2 w-2 rounded-full bg-coral" />
          Agora
        </p>
        <p className="font-mono text-[11px] text-white/60">dados simulados</p>
      </div>

      {/* Os 6 ônibus: uma barrinha por rua, com a posição do ônibus */}
      <ul className="mt-4 space-y-2.5">
        {frota.map((o) => (
          <li key={o.ruaId} className="grid grid-cols-[8.5rem_1fr] items-center gap-3 text-sm">
            <span className="truncate text-white/85">{o.ruaNome}</span>
            <span className="relative h-1.5 rounded-full bg-white/15" aria-hidden="true">
              <span
                className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-ambar"
                style={{ left: `${o.fracao * 100}%` }}
              />
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-5 border-t border-white/10 pt-4">
        <p className="text-sm text-white/70">
          <span className="text-2xl font-medium text-white tabular-nums">3</span> lugares com problema agora
        </p>
        <ul className="mt-3 space-y-2">
          {ocorrencias.slice(0, 3).map((o) => (
            <li key={o.id} className="flex items-start gap-2 text-sm">
              <span className="mt-0.5 rounded bg-white p-0.5">
                <StatusPicto estado={o.estado} tamanho={14} />
              </span>
              <span>
                <span className="text-white">{o.rua}, {o.local}</span>
                <span className="block text-xs text-white/60">
                  {CAMADAS[o.camada].nome} · {ROTULOS_ESTADO[o.estado]}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default PainelAoVivo
