// Modo demonstração (fim da tela do Cidadão): um painel de controle da simulação.
// - Play/Pausa e "+15 s" para controlar o tempo
// - Velocidade (1x, 2x, 5x, 10x): na 1x cada ônibus leva 3 minutos por passagem; na 10x, 18 segundos
// - Chave do chamado automático: ligada, a regra do 3º alerta seguido cria chamados na API
// O visual é de controle (botões grandes, pílulas e uma chave), para não parecer só um aviso.
//
// Props: pausado, aoPausar, aoAvancar, velocidade,
// aoMudarVelocidade, bloqueado (sem conexão), automaticoLigado e aoAlternarAutomatico.
import { VELOCIDADES } from '../utils/simulacao.js'
import { PASSAGENS_PARA_CHAMADO } from '../utils/regras.js'
import { DURACAO_PASSAGEM_MS } from '../utils/rota.js'

// Desenho do play (▶) e da pausa (❚❚).
function IconePlay({ pausado }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      {pausado ? <path d="M7 4l13 8-13 8z" fill="currentColor" /> : <path d="M6 4h4v16H6zM14 4h4v16h-4z" fill="currentColor" />}
    </svg>
  )
}

function ControlesDemo({
  pausado,
  aoPausar,
  aoAvancar,
  velocidade,
  aoMudarVelocidade,
  bloqueado,
  automaticoLigado,
  aoAlternarAutomatico,
}) {
  const atual = VELOCIDADES.find((v) => v.id === velocidade)
  // Quanto tempo de verdade leva uma passagem nesta velocidade, e as passagens da regra.
  const segundosPorPassagem = DURACAO_PASSAGEM_MS / 1000 / atual.fator
  const minutosAteRegra = (segundosPorPassagem * PASSAGENS_PARA_CHAMADO) / 60
  const numero = (n) => n.toLocaleString('pt-BR', { maximumFractionDigits: 1 })

  return (
    <section aria-labelledby="titulo-demo" className="rounded-2xl bg-tinta p-4 text-white md:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="titulo-demo" className="font-mono text-[11px] tracking-[0.18em] text-coral uppercase">
          Modo demonstração
        </h2>
        {/* Quanto tempo de verdade leva uma passagem na velocidade escolhida */}
        <p className="font-mono text-xs text-ambar" role="status">
          1 passagem = {numero(segundosPorPassagem)} s
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {/* Tempo: play/pausa e adiantar */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={aoPausar}
            disabled={bloqueado}
            className="flex min-h-11 items-center gap-2 rounded-full bg-coral px-5 font-medium text-tinta transition hover:brightness-110 disabled:opacity-50"
          >
            <IconePlay pausado={pausado} />
            {pausado ? 'Continuar' : 'Pausar'}
          </button>
          <button
            type="button"
            onClick={aoAvancar}
            disabled={bloqueado}
            className="min-h-11 rounded-full border border-white/30 px-4 font-medium transition hover:border-white disabled:opacity-50"
          >
            +15 s
          </button>
        </div>

        {/* Velocidade: controle segmentado (a escolhida fica branca) */}
        <div role="group" aria-labelledby="rotulo-velocidade" className="flex items-center gap-2">
          <span id="rotulo-velocidade" className="text-sm text-white/70">
            Velocidade
          </span>
          <div className="flex rounded-full bg-white/10 p-1">
            {VELOCIDADES.map((v) => (
              <button
                key={v.id}
                type="button"
                aria-pressed={v.id === velocidade}
                onClick={() => aoMudarVelocidade(v.id)}
                className={`min-h-11 min-w-11 rounded-full px-3 text-sm font-medium transition ${
                  v.id === velocidade ? 'bg-white text-tinta' : 'text-white/80 hover:text-white'
                }`}
              >
                {v.rotulo}
              </button>
            ))}
          </div>
        </div>

        {/* Chave liga/desliga do chamado automático. role="switch" + aria-checked: o leitor de tela diz "ligado/desligado". */}
        <button
          type="button"
          role="switch"
          aria-checked={automaticoLigado}
          onClick={aoAlternarAutomatico}
          className="flex min-h-11 items-center gap-3 rounded-full border border-white/20 py-1 pr-4 pl-1.5 transition hover:border-white/60 md:ml-auto"
        >
          <span
            aria-hidden="true"
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${automaticoLigado ? 'bg-coral' : 'bg-white/20'}`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-[left] ${automaticoLigado ? 'left-6' : 'left-1'}`}
            />
          </span>
          <span className="text-left text-sm leading-tight">
            <span className="block font-medium">Chamado automático</span>
            <span className="block text-white/70">{automaticoLigado ? 'Ligado' : 'Desligado'}</span>
          </span>
        </button>
      </div>

      <p className="mt-3 text-sm text-white/70">
        {automaticoLigado
          ? `Ligado: no ${PASSAGENS_PARA_CHAMADO}º alerta seguido num ponto, o app abre um chamado na API (nesta velocidade, uns ${numero(minutosAteRegra)} min).`
          : `Ligue para a regra do ${PASSAGENS_PARA_CHAMADO}º alerta seguido criar chamados na API. Use 10x para ver acontecer mais rápido.`}
      </p>
    </section>
  )
}

export default ControlesDemo
