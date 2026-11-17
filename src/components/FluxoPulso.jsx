// Diagrama "Por dentro do Pulso" (Início, fundo escuro). Mostra o fluxo em 2 faixas:
// 1. O caminho do dado: dispositivo → back-end → aplicações (com o rótulo de cada ligação).
// 2. O caminho de um problema: leitura → estado → alertas seguidos (ou aviso do cidadão) → chamado → agente.
// As ligações são linhas coral tracejadas que "andam" (param quando a pessoa pede menos movimento).
//
// Props: blocos (POR_DENTRO) e etapas (FLUXO_DO_CHAMADO), ambos de data/inicio.js.
import StatusPicto from './StatusPicto.jsx'
import IconePerfil from './IconePerfil.jsx'
import { PASSAGENS_PARA_CHAMADO } from '../utils/regras.js'

// Traço branco fino usado nos desenhos (o coral marca o que é "do Pulso").
const TRACO = { fill: 'none', stroke: '#FFFFFF', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }

// Desenho de cada bloco da faixa 1.
function IconeBloco({ tipo }) {
  if (tipo === 'dispositivo') {
    // Placa ESP32 com os pinos e o sinal saindo da antena
    return (
      <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
        <rect x="12" y="18" width="26" height="26" rx="3" {...TRACO} />
        <rect x="19" y="25" width="12" height="12" rx="1" fill="#FFB000" />
        <path d="M17 14v4M25 14v4M33 14v4M17 44v4M25 44v4M33 44v4M8 24h4M8 32h4M8 40h4M38 24h4M38 32h4M38 40h4" {...TRACO} />
        <path d="M44 14a6 6 0 0 1 6 6M44 8a12 12 0 0 1 12 12" fill="none" stroke="#F0634C" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }
  if (tipo === 'servidor') {
    // Servidor: 3 gavetas empilhadas, com as luzes acesas
    return (
      <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
        {[10, 23, 36].map((y) => (
          <g key={y}>
            <rect x="10" y={y} width="36" height="10" rx="2" {...TRACO} />
            <circle cx="16" cy={y + 5} r="1.6" fill="#F0634C" />
            <path d={`M24 ${y + 5}h16`} {...TRACO} />
          </g>
        ))}
      </svg>
    )
  }
  // Aplicações: tela do painel + celular do cidadão
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
      <rect x="4" y="12" width="34" height="24" rx="2" {...TRACO} />
      <path d="M15 42h12M21 36v6" {...TRACO} />
      <path d="M9 30l7-7 5 4 8-9" fill="none" stroke="#F0634C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="36" y="20" width="16" height="28" rx="3" {...TRACO} fill="#15171B" />
      <path d="M44 38s-4-3.6-4-6.4a4 4 0 0 1 8 0c0 2.8-4 6.4-4 6.4z" fill="#F0634C" />
    </svg>
  )
}

// Desenho de cada etapa da faixa 2.
function IconeEtapa({ id }) {
  if (id === 'leitura') {
    return <span className="font-mono text-2xl text-ambar">1,8 lux</span>
  }
  if (id === 'estado') {
    return (
      <span className="flex items-center gap-1.5 rounded-lg bg-white px-2 py-1.5">
        <StatusPicto estado="normal" tamanho={20} />
        <StatusPicto estado="atencao" tamanho={20} />
        <StatusPicto estado="critico" tamanho={20} />
      </span>
    )
  }
  if (id === 'alertas') {
    // Os alertas seguidos e, ao lado, o outro jeito: o aviso do cidadão
    return (
      <span className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 rounded-lg bg-white px-2 py-1.5">
          {Array.from({ length: PASSAGENS_PARA_CHAMADO }, (_, i) => (
            <StatusPicto key={i} estado="critico" tamanho={18} />
          ))}
        </span>
        <span className="font-mono text-[11px] text-white/70">ou</span>
        <IconePerfil tipo="cidadao" tamanho={34} cor="#FFFFFF" fundo="#15171B" />
      </span>
    )
  }
  if (id === 'chamado') {
    // Bilhete com picote (o mesmo desenho dos chamados do app)
    return (
      <svg width="56" height="36" viewBox="0 0 56 36" aria-hidden="true">
        <path d="M4 4h48v10a4 4 0 0 0 0 8v10H4V22a4 4 0 0 0 0-8z" {...TRACO} />
        <path d="M14 12h20M14 18h26M14 24h14" {...TRACO} />
        <rect x="38" y="22" width="10" height="6" rx="1" fill="#F0634C" />
      </svg>
    )
  }
  return <IconePerfil tipo="agente" tamanho={40} cor="#FFFFFF" fundo="#15171B" />
}

// Ligação entre dois blocos: linha tracejada que anda (na horizontal no computador, na vertical no celular).
// "rotulo" aparece em cima da linha (ex.: "MQTT"). "quebra" é o tamanho de tela em que ela deita.
function Ligacao({ rotulo, quebra }) {
  // Largura fixa: a linha não "rouba" espaço dos blocos.
  const deitada = quebra === 'md' ? 'md:h-auto md:w-20 md:flex-col' : 'lg:h-auto lg:w-8 lg:flex-col'
  const linha = quebra === 'md' ? 'md:fluxo-linha-h md:h-0.5 md:w-full' : 'lg:fluxo-linha-h lg:h-0.5 lg:w-full'
  return (
    <div aria-hidden="true" className={`flex h-12 shrink-0 items-center justify-center gap-2 self-center ${deitada}`}>
      {rotulo && <span className="text-center font-mono text-[11px] leading-tight text-coral">{rotulo}</span>}
      <span className={`fluxo-linha-v h-full w-0.5 ${linha}`} />
    </div>
  )
}

function FluxoPulso({ blocos, etapas }) {
  return (
    <div className="space-y-16">
      {/* ===== Faixa 1: o caminho do dado ===== */}
      <div>
        <p className="font-mono text-[11px] tracking-[0.18em] text-white/70 uppercase">O caminho do dado</p>
        <ol className="mt-5 flex flex-col md:flex-row md:items-stretch">
          {blocos.map((b, i) => (
            <li key={b.titulo} className="contents">
              <div className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-[#1E2126] p-6">
                <div className="flex items-start justify-between">
                  <IconeBloco tipo={b.icone} />
                  <span className="font-mono text-xs text-coral">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <span className="mt-5 block text-2xl font-medium tracking-tight">{b.titulo}</span>
                <span className="mt-2 block text-white/70">{b.texto}</span>
              </div>
              {i < blocos.length - 1 && <Ligacao rotulo={b.ligacao} quebra="md" />}
            </li>
          ))}
        </ol>
      </div>

      {/* ===== Faixa 2: o caminho de um problema (regra de negócio) ===== */}
      <div>
        <p className="font-mono text-[11px] tracking-[0.18em] text-white/70 uppercase">O caminho de um problema</p>
        <ol className="mt-5 flex flex-col lg:flex-row lg:items-stretch">
          {etapas.map((e, i) => (
            <li key={e.id} className="contents">
              <div
                className={`flex min-w-0 flex-1 flex-col rounded-2xl border p-5 ${
                  e.id === 'chamado' ? 'border-coral bg-coral/10' : 'border-white/10 bg-[#1E2126]'
                }`}
              >
                <span className="flex min-h-11 items-center">
                  <IconeEtapa id={e.id} />
                </span>
                <span className="mt-4 block text-lg font-medium tracking-tight">{e.titulo}</span>
                <span className="mt-1 block text-sm text-white/70">{e.texto}</span>
              </div>
              {i < etapas.length - 1 && <Ligacao quebra="lg" />}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export default FluxoPulso
