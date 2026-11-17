// Simulador da solução (seção "A solução" do Início).
// A pessoa vive as 4 etapas do Pulso, e cada etapa só libera a próxima depois que ela interage:
// 1. Mede: liga o sensor no teto do ônibus e vê as leituras, uma por vez. A luz dá crítico: é o 1º alerta.
// 2. Confirma: escolhe um dos 2 jeitos de confirmar o problema:
//    - automático: o ônibus passa de novo até o 3º alerta seguido;
//    - cidadão: alguém que passa por ali avisa pelo app.
// 3. Abre o chamado: vê o chamado que nasceu (automático ou do cidadão) e envia à subprefeitura.
// 4. Orienta: escolhe o caminho para voltar a pé à noite.
// Tudo aqui é um exemplo ilustrativo (dados simulados), com o mesmo lugar da simulação do app.
//
// Props: passos (títulos e textos de data/inicio.js).
import { useState, useEffect } from 'react'
import StatusPicto from './StatusPicto.jsx'
import IconePerfil from './IconePerfil.jsx'
import IconeProblema from './IconeProblema.jsx'
import { PASSAGENS_PARA_CHAMADO } from '../utils/regras.js'
import { TIPOS_DE_PROBLEMA, prioridadePorEstado, ROTULOS_PRIORIDADE, rotuloTipo } from '../utils/chamados.js'

// O exemplo usado nas etapas (o mesmo trecho escuro da R. Oscar Freire da simulação).
const LUGAR = 'R. Oscar Freire, nº 1036 a 1056'
const LEITURAS = [
  { nome: 'Calor', valor: '26,4\u00a0°C', estado: 'normal' }, // \u00a0: espaço que não quebra
  { nome: 'Luz à noite', valor: '1,8\u00a0lux', estado: 'critico' },
  { nome: 'Pavimento', valor: '1,05\u00a0g', estado: 'normal' },
  { nome: 'Ar (PM2.5)', valor: '17\u00a0µg/m³', estado: 'normal' },
]
// Estado de cada camada neste lugar (a prioridade do aviso do cidadão segue o sensor, como no app).
const ESTADOS_DO_LUGAR = { calor: 'normal', luz: 'critico', pavimento: 'normal', ar: 'normal' }

// Os 2 jeitos de confirmar o problema e abrir o chamado.
const JEITOS = [
  {
    id: 'automatico',
    titulo: 'Automático',
    texto: `O ônibus passa de novo. No ${PASSAGENS_PARA_CHAMADO}º alerta seguido, o chamado nasce sozinho.`,
  },
  {
    id: 'cidadao',
    titulo: 'Pelo cidadão',
    texto: 'Quem passa por ali vê o problema e avisa pelo app, sem esperar o ônibus voltar.',
  },
]

const CAMINHOS = [
  { id: 'escuro', letra: 'A', nome: 'Pela R. Oscar Freire', detalhe: 'Mais curto, mas passa pelo nº 1036 a 1056', bom: false },
  { id: 'iluminado', letra: 'B', nome: 'Pela Av. Paulista', detalhe: '4 minutos a mais, trecho todo iluminado', bom: true },
]

// Pictograma de cadeado (etapa ainda bloqueada).
function Cadeado() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

// Pictograma do ônibus visto de frente (para o jeito "automático").
function IconeOnibus({ tamanho = 56 }) {
  const traco = { fill: 'none', stroke: '#15171B', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 56 56" aria-hidden="true">
      {/* caixa de sensores no teto */}
      <rect x="21" y="4" width="14" height="5" rx="1" fill="#FFB000" stroke="#15171B" strokeWidth="1.6" />
      <rect x="10" y="10" width="36" height="38" rx="5" {...traco} />
      <path d="M10 22h36M10 36h36" {...traco} />
      <circle cx="17" cy="42" r="2" fill="#15171B" />
      <circle cx="39" cy="42" r="2" fill="#15171B" />
      <path d="M15 48v4M41 48v4" {...traco} />
      {/* letreiro */}
      <rect x="15" y="14" width="26" height="4" rx="1" fill="#15171B" />
    </svg>
  )
}

// Botão principal de cada etapa (para não repetir as classes).
function BotaoAcao({ children, ...props }) {
  return (
    <button
      type="button"
      className="min-h-12 rounded-full bg-tinta px-6 font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    >
      {children}
    </button>
  )
}

// Aviso de "escolha uma opção", para deixar claro que a pessoa precisa clicar.
function PedidoDeEscolha({ children }) {
  return (
    <p className="flex items-center gap-2 font-medium">
      <span className="rounded-full bg-coral px-2.5 py-0.5 font-mono text-[11px] tracking-wider text-tinta uppercase">
        Selecione uma opção
      </span>
      {children}
    </p>
  )
}

// Bolinha de rádio desenhada (marcada ou não), ao lado de cada opção.
function Radio({ marcado }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${marcado ? 'border-tinta' : 'border-linha-forte'}`}
    >
      {marcado && <span className="h-2.5 w-2.5 rounded-full bg-tinta" />}
    </span>
  )
}

function SimuladorSolucao({ passos }) {
  const [etapa, setEtapa] = useState(0) // etapa aberta (0 a 3)
  const [ligado, setLigado] = useState(false) // etapa 1: sensor ligado?
  const [jeito, setJeito] = useState(null) // etapa 2: 'automatico' ou 'cidadao'
  const [alertas, setAlertas] = useState(1) // etapa 2 (automático): alertas críticos seguidos (o 1º veio na etapa 1)
  const [tipoAviso, setTipoAviso] = useState('') // etapa 2 (cidadão): tipo escolhido no aviso
  const [avisoEnviado, setAvisoEnviado] = useState(false) // etapa 2 (cidadão): aviso enviado?
  const [enviado, setEnviado] = useState(false) // etapa 3: chamado enviado à subprefeitura?
  const [escolha, setEscolha] = useState(null) // etapa 4: caminho escolhido
  const [lidas, setLidas] = useState(0) // etapa 1: quantas leituras já apareceram (uma por vez)

  // Depois de ligar o sensor, mostra uma leitura nova a cada 0,9 s, até as 4.
  useEffect(() => {
    if (!ligado || lidas >= LEITURAS.length) return
    const espera = setTimeout(() => setLidas((n) => n + 1), 900)
    return () => clearTimeout(espera) // se o componente sair da tela, cancela
  }, [ligado, lidas])

  // A etapa 2 fica feita quando o jeito escolhido chegou ao fim.
  const confirmado = (jeito === 'automatico' && alertas >= PASSAGENS_PARA_CHAMADO) || (jeito === 'cidadao' && avisoEnviado)
  // Cada etapa fica "feita" quando a pessoa completou a interação dela.
  const feitas = [lidas >= LEITURAS.length, confirmado, enviado, escolha === 'iluminado']
  // Uma etapa só pode ser aberta se todas as anteriores já foram feitas.
  const liberada = (i) => feitas.slice(0, i).every(Boolean)

  // Trocar o jeito recomeça a etapa 2 (e o que vem depois dela).
  function escolherJeito(novo) {
    setJeito(novo)
    setAlertas(1)
    setTipoAviso('')
    setAvisoEnviado(false)
    setEnviado(false)
    setEscolha(null)
  }

  // "Testar o outro jeito": volta para a etapa 2 com a outra opção marcada.
  function testarOutroJeito() {
    escolherJeito(jeito === 'automatico' ? 'cidadao' : 'automatico')
    setEtapa(1)
  }

  function recomecar() {
    setEtapa(0)
    setLigado(false)
    setLidas(0)
    escolherJeito(null)
  }

  // O chamado que nasce na etapa 3 depende do jeito escolhido.
  const chamado =
    jeito === 'cidadao'
      ? {
          rotulo: 'Chamado do cidadão',
          tipoId: tipoAviso,
          tipo: rotuloTipo(tipoAviso),
          prioridade: prioridadePorEstado(ESTADOS_DO_LUGAR[tipoAviso]),
          texto: 'Aviso enviado pelo app. A prioridade segue a leitura do sensor neste ponto.',
        }
      : {
          rotulo: 'Chamado automático',
          tipoId: 'luz',
          tipo: 'Luz à noite',
          prioridade: 'alta',
          texto: `Leitura crítica em ${PASSAGENS_PARA_CHAMADO} passagens seguidas. Ninguém precisou reclamar.`,
        }

  const caminhoEscolhido = CAMINHOS.find((c) => c.id === escolha)

  return (
    <div className="grid overflow-hidden rounded-3xl border border-linha bg-white shadow-suave lg:grid-cols-[300px_1fr]">
      {/* Lista das etapas (à esquerda). No computador, as 4 etapas dividem a altura toda da barra,
          cada uma com o número grande, o título e a situação (agora, feita ou bloqueada).
          No celular, as 4 ficam lado a lado numa linha (número em cima, título embaixo). */}
      <ol className="grid grid-cols-4 gap-1 border-b border-linha bg-papel p-2 sm:flex sm:flex-col sm:gap-2 sm:p-3 lg:border-r lg:border-b-0">
        {passos.map((p, i) => {
          const aberta = i === etapa
          const situacao = feitas[i] ? 'Feita' : aberta ? 'Agora' : liberada(i) ? 'Liberada' : 'Bloqueada: termine a anterior'
          return (
            <li key={p.numero} className="lg:flex-1">
              <button
                type="button"
                disabled={!liberada(i)}
                aria-current={aberta ? 'step' : undefined}
                onClick={() => setEtapa(i)}
                className={`flex h-full min-h-12 w-full flex-col items-center gap-1 rounded-xl px-1 py-2 text-center transition sm:flex-row sm:gap-3 sm:px-3 sm:text-left lg:flex-col lg:items-start lg:justify-between lg:gap-4 lg:border lg:p-4 ${
                  aberta ? 'bg-white shadow-suave lg:border-tinta' : 'hover:bg-white/60 lg:border-linha lg:border-dashed'
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs lg:h-10 lg:w-10 lg:text-sm ${
                    feitas[i] ? 'bg-normal text-white' : aberta ? 'bg-tinta text-white' : 'border border-linha-forte text-tinta-2'
                  }`}
                >
                  {feitas[i] ? '✓' : liberada(i) ? p.numero : <Cadeado />}
                </span>
                <span>
                  <span className="block text-xs leading-tight font-medium sm:text-base lg:text-lg">{p.titulo}</span>
                  <span className="hidden font-mono text-[11px] text-tinta-2 lg:block">{situacao}</span>
                </span>
              </button>
            </li>
          )
        })}
        <li className="col-span-4 px-1 pt-1 text-center font-mono text-[11px] text-tinta-2 sm:px-3 sm:text-left">Exemplo ilustrativo · dados simulados</li>
      </ol>

      {/* Palco da etapa aberta (à direita) */}
      {/* Altura mínima = a da etapa mais alta (a 1, com a foto), para o quadro não mudar de tamanho entre as etapas.
          A foto tem largura máxima de 480 px, então essa altura é fixa e cabe numa tela comum. */}
      <div className="min-w-0 p-5 md:p-6 lg:min-h-[632px]">
        <p className="font-mono text-[11px] tracking-[0.18em] text-[#B8402D] uppercase">
          Etapa {passos[etapa].numero} de 04
        </p>
        <h3 className="mt-1 text-2xl font-medium tracking-tight">{passos[etapa].titulo}</h3>
        <p className="mt-2 max-w-xl text-tinta-2">{passos[etapa].texto}</p>

        <div className="mt-4">
          {/* ===== Etapa 1: Mede ===== */}
          {etapa === 0 && (
            <div>
              {/* A foto fica no formato original (sem cortar): assim a caixa no teto cai sempre no lugar certo. */}
              <div className="relative aspect-[16/9] max-w-[480px] overflow-hidden rounded-2xl bg-tinta">
                <img
                  src="/imagens/onibus-ana-rosa.webp"
                  alt="Ônibus municipal passando pela Av. Paulista à noite"
                  className="h-full w-full object-cover"
                />
                {/* A caixa de sensores no teto do ônibus (posição aproximada na foto) */}
                <span
                  aria-hidden="true"
                  className={`absolute top-[7.5%] left-[34.5%] h-3 w-10 -translate-x-1/2 -translate-y-full rounded-sm border-2 border-tinta bg-ambar sm:h-4 sm:w-14 ${
                    ligado ? 'sensor-lendo' : ''
                  }`}
                />
                <span className="absolute top-[2%] left-[52%] rounded-full bg-tinta px-2.5 py-1 font-mono text-[11px] text-ambar">
                  ← {ligado ? 'sensor ligado · medindo' : 'caixa de sensores'}
                </span>
              </div>

              {/* Leituras: uma por vez. As que ainda não chegaram mostram "lendo…" (o espaço já fica reservado). */}
              {ligado && (
                <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-live="polite">
                  {LEITURAS.map((l, i) =>
                    i < lidas ? (
                      <li
                        key={l.nome}
                        className={`surgir rounded-xl border p-2.5 text-sm ${l.estado === 'critico' ? 'border-critico bg-critico/5' : 'border-linha'}`}
                      >
                        <span className="flex items-center gap-1.5 text-xs text-tinta-2">
                          <StatusPicto estado={l.estado} tamanho={14} />
                          {l.nome}
                        </span>
                        <span className="font-mono font-medium">{l.valor}</span>
                      </li>
                    ) : (
                      <li key={l.nome} className="rounded-xl border border-dashed border-linha-forte p-2.5 text-sm text-tinta-2">
                        <span className="block text-xs">{l.nome}</span>
                        <span className="font-mono">{i === lidas ? 'lendo…' : '—'}</span>
                      </li>
                    ),
                  )}
                </ul>
              )}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                {!ligado ? (
                  <BotaoAcao onClick={() => setLigado(true)}>Ligar o sensor</BotaoAcao>
                ) : lidas < LEITURAS.length ? (
                  <p className="text-sm text-tinta-2">
                    Medindo {lidas + 1} de {LEITURAS.length}…
                  </p>
                ) : (
                  <>
                    <p className="text-sm text-tinta-2" aria-live="polite">
                      Luz crítica na {LUGAR}. É o <strong className="font-medium text-tinta">1º alerta</strong>. Um alerta só pode ser engano: falta confirmar.
                    </p>
                    <BotaoAcao onClick={() => setEtapa(1)}>Próxima etapa →</BotaoAcao>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ===== Etapa 2: Confirma (os 2 jeitos) ===== */}
          {etapa === 1 && (
            <div>
              <PedidoDeEscolha>Como o problema vai ser confirmado?</PedidoDeEscolha>
              <div className="mt-4 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Jeito de abrir o chamado">
                {JEITOS.map((j) => {
                  const marcado = jeito === j.id
                  return (
                    <button
                      key={j.id}
                      type="button"
                      role="radio"
                      aria-checked={marcado}
                      onClick={() => escolherJeito(j.id)}
                      className={`flex min-h-12 gap-4 rounded-2xl border p-4 text-left transition ${
                        marcado ? 'border-tinta bg-papel' : 'border-linha hover:border-linha-forte'
                      }`}
                    >
                      {j.id === 'automatico' ? <IconeOnibus tamanho={48} /> : <IconePerfil tipo="cidadao" tamanho={48} />}
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2 font-medium">
                          {j.titulo}
                          <Radio marcado={marcado} />
                        </span>
                        <span className="mt-1 block text-sm text-tinta-2">{j.texto}</span>
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Jeito automático: o ônibus passa de novo e soma alertas */}
              {jeito === 'automatico' && (
                <div className="surgir mt-5">
                  <div className="rounded-2xl bg-tinta p-5 text-white">
                    <p className="font-mono text-[11px] text-white/70 uppercase">{LUGAR}</p>
                    <div className="relative mt-4 h-3 rounded-full bg-white/10">
                      <span className="absolute top-1/2 left-1/2 h-6 w-16 -translate-x-1/2 -translate-y-1/2 rounded bg-critico/40" aria-hidden="true" />
                      <span
                        aria-hidden="true"
                        className="absolute top-1/2 h-5 w-9 -translate-y-1/2 rounded-md border-2 border-white bg-tinta transition-[left] duration-700"
                        style={{ left: alertas % 2 === 0 ? 'calc(100% - 2.25rem)' : '0%' }}
                      >
                        <span className="absolute top-1 left-1/2 h-1.5 w-3 -translate-x-1/2 bg-ambar" />
                      </span>
                    </div>
                    {/* Os alertas seguidos: cada um vira um octógono crítico */}
                    <ol className="mt-6 flex gap-2" aria-label={`${alertas} de ${PASSAGENS_PARA_CHAMADO} alertas seguidos`}>
                      {Array.from({ length: PASSAGENS_PARA_CHAMADO }, (_, i) => (
                        <li
                          key={i}
                          className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border font-mono text-xs ${
                            i < alertas ? 'border-transparent bg-white text-tinta' : 'border-dashed border-white/25 text-white/50'
                          }`}
                        >
                          {i < alertas && <StatusPicto estado="critico" tamanho={18} />}
                          {i + 1}º alerta
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    {alertas < PASSAGENS_PARA_CHAMADO ? (
                      <>
                        <BotaoAcao onClick={() => setAlertas(alertas + 1)}>Fazer o ônibus passar de novo</BotaoAcao>
                        <p className="text-sm text-tinta-2" aria-live="polite">
                          {alertas} de {PASSAGENS_PARA_CHAMADO} alertas seguidos.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-tinta-2" aria-live="polite">
                          {PASSAGENS_PARA_CHAMADO}º alerta seguido. Não é engano: o trecho está mesmo escuro e o chamado nasce sozinho.
                        </p>
                        <BotaoAcao onClick={() => setEtapa(2)}>Ver o chamado →</BotaoAcao>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Jeito do cidadão: um aviso rápido, como o botão "Avisar problema" do app */}
              {jeito === 'cidadao' && (
                <div className="surgir mt-5 grid gap-5 md:grid-cols-[minmax(0,320px)_1fr] md:items-start">
                  <div className="rounded-3xl border-4 border-tinta bg-papel p-4">
                    <p className="rounded-lg bg-tinta px-3 py-2 font-mono text-xs text-ambar">
                      {avisoEnviado ? 'Aviso recebido' : 'Avisar problema'}
                    </p>
                    <p className="mt-3 text-xs text-tinta-2">Local</p>
                    <p className="text-sm font-medium">{LUGAR}</p>
                    <fieldset className="mt-3" disabled={avisoEnviado}>
                      <legend className="text-xs text-tinta-2">Tipo do problema (escolha um)</legend>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {TIPOS_DE_PROBLEMA.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            aria-pressed={tipoAviso === t.id}
                            onClick={() => setTipoAviso(t.id)}
                            className={`min-h-11 rounded-full border px-3 text-sm transition ${
                              tipoAviso === t.id ? 'border-tinta bg-tinta text-white' : 'border-linha-forte bg-white hover:border-tinta'
                            }`}
                          >
                            {t.nome}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                  <div className="flex flex-wrap items-center gap-3" aria-live="polite">
                    {!avisoEnviado ? (
                      <>
                        <button
                          type="button"
                          disabled={!tipoAviso}
                          onClick={() => setAvisoEnviado(true)}
                          className="min-h-12 rounded-full bg-critico px-6 font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Enviar aviso
                        </button>
                        <p className="text-sm text-tinta-2">{tipoAviso ? `Tipo: ${rotuloTipo(tipoAviso)}.` : 'Escolha o tipo do problema no celular.'}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-tinta-2">Aviso recebido. O chamado nasce na hora, sem esperar o ônibus voltar.</p>
                        <BotaoAcao onClick={() => setEtapa(2)}>Ver o chamado →</BotaoAcao>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===== Etapa 3: Abre o chamado ===== */}
          {etapa === 2 && (
            <div>
              {/* O chamado que nasceu: um bilhete igual ao do painel do agente */}
              <article className="surgir max-w-md overflow-hidden rounded-2xl border border-linha bg-white shadow-suave">
                <div className="flex items-start justify-between gap-3 p-4">
                  <div>
                    <p className="font-mono text-[11px] tracking-wider text-tinta-2 uppercase">{chamado.rotulo}</p>
                    <p className="font-mono text-lg">PL-EXEMPLO</p>
                  </div>
                  <span
                    className={`-rotate-3 rounded-md border-2 px-2 py-0.5 font-mono text-xs uppercase ${
                      enviado ? 'border-[#B58800] bg-atencao/25 text-tinta' : 'border-critico/60 bg-critico/5 text-[#A3160F]'
                    }`}
                  >
                    {enviado ? 'Na fila da subprefeitura' : 'Aberto'}
                  </span>
                </div>
                {/* Ícone do tipo do problema, para identificar de relance */}
                <div className="flex gap-4 border-t border-dashed border-linha p-4 text-sm">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-linha bg-papel">
                    <IconeProblema tipo={chamado.tipoId} tamanho={40} />
                  </span>
                  <div>
                    <p className="font-medium">
                      {chamado.tipo} · {LUGAR}
                    </p>
                    <p className="mt-1 text-tinta-2">
                      {chamado.texto} Prioridade {ROTULOS_PRIORIDADE[chamado.prioridade].toLowerCase()}.
                    </p>
                  </div>
                </div>
              </article>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                {!enviado ? (
                  <BotaoAcao onClick={() => setEnviado(true)}>Enviar para a subprefeitura</BotaoAcao>
                ) : (
                  <>
                    <p className="text-sm text-tinta-2" aria-live="polite">
                      Pronto. O agente já vê o chamado no mapa, no número exato da rua.
                    </p>
                    <BotaoAcao onClick={() => setEtapa(3)}>Próxima etapa →</BotaoAcao>
                  </>
                )}
                <button type="button" onClick={testarOutroJeito} className="min-h-12 px-3 text-sm font-medium underline underline-offset-2">
                  Testar o outro jeito ({jeito === 'automatico' ? 'pelo cidadão' : 'automático'})
                </button>
              </div>
            </div>
          )}

          {/* ===== Etapa 4: Orienta ===== */}
          {etapa === 3 && (
            <div>
              <PedidoDeEscolha>É noite e você vai voltar a pé. Por onde você vai?</PedidoDeEscolha>
              <p className="mt-1 text-sm text-tinta-2">Toque em um dos 2 caminhos abaixo.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Escolha o caminho">
                {CAMINHOS.map((c) => {
                  const marcado = escolha === c.id
                  return (
                    <button
                      key={c.id}
                      type="button"
                      role="radio"
                      aria-checked={marcado}
                      onClick={() => setEscolha(c.id)}
                      className={`min-h-12 rounded-2xl border p-4 text-left transition ${
                        marcado ? (c.bom ? 'border-normal bg-normal/5' : 'border-critico bg-critico/5') : 'border-linha hover:border-linha-forte'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Radio marcado={marcado} />
                        <span className="font-mono text-[11px] tracking-wider text-tinta-2 uppercase">Opção {c.letra}</span>
                        {marcado && <StatusPicto estado={c.bom ? 'normal' : 'critico'} tamanho={18} />}
                      </span>
                      <span className="mt-2 block font-medium">{c.nome}</span>
                      <span className="mt-1 block text-sm text-tinta-2">{c.detalhe}</span>
                    </button>
                  )
                })}
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3" aria-live="polite">
                {caminhoEscolhido && !caminhoEscolhido.bom && (
                  <p className="text-sm text-[#A3160F]">
                    Esse caminho passa pelo trecho escuro que o Pulso confirmou. O app avisaria antes. Tente a outra opção.
                  </p>
                )}
                {caminhoEscolhido?.bom && (
                  <>
                    <p className="text-sm text-normal">Boa escolha. É isso que o app mostra para o cidadão: o caminho mais iluminado.</p>
                    <BotaoAcao onClick={recomecar}>Recomeçar</BotaoAcao>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SimuladorSolucao
