// Página inicial (Início): explica o problema e a solução e leva para as demonstrações
// do Cidadão e do Agente. O texto segue o discurso do vídeo do grupo; os números reais
// têm fonte (data/inicio.js). O painel do topo mostra a simulação rodando de verdade.
//
// Visual: topo escuro com a linha do pulso de ponta a ponta, números gigantes vazados, termômetro
// que sobe ao rolar a página, um simulador em que a pessoa vive as 4 etapas do Pulso e o
// diagrama do fluxo. As fontes dos números ficam só no rodapé.
//
// Props: frota e pontos (da simulação, para o painel ao vivo) e aoIr(aba) para abrir uma tela.
import MarcaPulso from '../components/MarcaPulso.jsx'
import PainelAoVivo from '../components/PainelAoVivo.jsx'
import CartaoDado from '../components/CartaoDado.jsx'
import ComparacaoCalor from '../components/ComparacaoCalor.jsx'
import SimuladorSolucao from '../components/SimuladorSolucao.jsx'
import FluxoPulso from '../components/FluxoPulso.jsx'
import IconePerfil from '../components/IconePerfil.jsx'
import { DADOS, COMPARACAO_CALOR, PASSOS, POR_DENTRO, FLUXO_DO_CHAMADO, FONTES } from '../data/inicio.js'

// Cabeçalho de seção: número grande em fonte mono + rótulo (ex.: "01 — O problema").
function CabecalhoSecao({ numero, rotulo, escuro = false }) {
  return (
    <p className={`flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] uppercase ${escuro ? 'text-white/70' : 'text-tinta-2'}`}>
      <span className={escuro ? 'text-coral' : 'text-[#B8402D]'}>{numero}</span>
      <span aria-hidden="true" className={`h-px w-10 ${escuro ? 'bg-white/30' : 'bg-linha-forte'}`} />
      {rotulo}
    </p>
  )
}

function Inicio({ frota, pontos, aoIr }) {
  return (
    <div>
      {/* ===== 00 · Topo (fundo escuro) ===== */}
      <section className="relative isolate overflow-hidden bg-tinta text-white">
        {/* A linha do "pulso" atravessando o topo de um lado ao outro da tela, desenhando-se sozinha */}
        <svg aria-hidden="true" viewBox="0 0 1200 120" preserveAspectRatio="none" className="desenhar-pulso absolute inset-x-0 bottom-6 -z-10 h-20 w-full">
          <polyline
            points="0,70 380,70 420,70 450,20 490,110 520,45 545,70 1200,70"
            fill="none"
            stroke="#F0634C"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl content-center gap-12 px-4 pt-16 pb-28 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <h1 className="max-w-3xl text-[2.6rem] leading-[1] font-medium tracking-tighter sm:text-6xl xl:text-7xl">
              São Paulo já tem 13 mil sensores andando pelas ruas.
              <span className="mt-2 block text-coral">Só falta ligar.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg text-white/80">
              O Pulso coloca sensores no teto dos ônibus que já rodam a cidade. Enquanto fazem a rota normal,
              eles medem <strong className="font-medium text-white">calor, iluminação, buracos e poluição</strong> em cada trecho da rua, e avisam quem precisa agir.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => aoIr('cidadao')}
                className="group min-h-12 rounded-full bg-coral px-6 font-medium text-tinta transition hover:brightness-110"
              >
                Ver como cidadão <span aria-hidden="true" className="inline-block transition group-hover:translate-x-1">→</span>
              </button>
              <button
                type="button"
                onClick={() => aoIr('agente')}
                className="min-h-12 rounded-full border border-white/30 px-6 font-medium text-white transition hover:border-white/70"
              >
                Ver como agente
              </button>
            </div>
          </div>

          <PainelAoVivo frota={frota} pontos={pontos} />
        </div>
      </section>

      {/* ===== 01 · O problema ===== */}
      <section aria-labelledby="titulo-problema" className="relative overflow-hidden">
        {/* Número gigante vazado de fundo (decoração) */}
        <span aria-hidden="true" className="texto-vazado-escuro pointer-events-none absolute -top-6 right-0 text-[14rem] leading-none font-medium tracking-tighter select-none md:text-[20rem]">
          01
        </span>
        <div className="relative mx-auto max-w-7xl px-4 py-24">
          <CabecalhoSecao numero="01" rotulo="O problema" />
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end">
            <h2 id="titulo-problema" className="text-4xl leading-[1.02] font-medium tracking-tighter sm:text-6xl">
              A cidade não enxerga a tempo.
            </h2>
            <p className="text-lg text-tinta-2">
              Idosos esperando o ônibus no sol, qualidade do ar ruim, pavimento de má qualidade, gente voltando para casa à noite por ruas escuras.
              Hoje, o poste apagado <strong className="font-medium text-tinta">só é consertado depois que alguém reclama,</strong> e o buraco espera vistoria.
            </p>
          </div>

          <div className="mt-14">
            <ComparacaoCalor {...COMPARACAO_CALOR} />
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {DADOS.map((d) => (
              <CartaoDado key={d.rotulo} valor={d.valor} rotulo={d.rotulo} detalhe={d.detalhe} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== 02 · A solução (simulador interativo) ===== */}
      <section aria-labelledby="titulo-solucao" className="relative overflow-hidden border-y border-linha bg-white">
        <span aria-hidden="true" className="texto-vazado-escuro pointer-events-none absolute -top-6 right-0 text-[14rem] leading-none font-medium tracking-tighter select-none md:text-[20rem]">
          02
        </span>
        <div className="relative mx-auto max-w-7xl px-4 py-24">
          <CabecalhoSecao numero="02" rotulo="A solução" />
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end">
            <h2 id="titulo-solucao" className="text-4xl leading-[1.02] font-medium tracking-tighter sm:text-6xl">
              Um conjunto de sensores no teto do ônibus.
            </h2>
            <p className="text-lg text-tinta-2">
              Faça você mesmo: ligue o sensor, escolha como o problema é confirmado (pelo ônibus ou por um cidadão) e veja o chamado nascer. Cada etapa libera a próxima.
            </p>
          </div>
          <div className="mt-14">
            <SimuladorSolucao passos={PASSOS} />
          </div>
        </div>
      </section>

      {/* ===== 03 · Por dentro do Pulso (escuro): diagrama do fluxo ===== */}
      <section aria-labelledby="titulo-dentro" className="bg-tinta text-white">
        <div className="mx-auto max-w-7xl px-4 py-24">
          <CabecalhoSecao numero="03" rotulo="Por dentro do Pulso" escuro />
          <h2 id="titulo-dentro" className="mt-6 max-w-3xl text-4xl leading-[1.02] font-medium tracking-tighter sm:text-6xl">
            Do sensor ao celular do cidadão.
          </h2>
          <div className="mt-14">
            <FluxoPulso blocos={POR_DENTRO} etapas={FLUXO_DO_CHAMADO} />
          </div>
        </div>
      </section>

      {/* ===== 04 · Demonstração ===== */}
      <section aria-labelledby="titulo-demo-inicio" className="mx-auto max-w-7xl px-4 py-24">
        <CabecalhoSecao numero="04" rotulo="Demonstração" />
        <h2 id="titulo-demo-inicio" className="mt-6 text-4xl leading-[1.02] font-medium tracking-tighter sm:text-6xl">
          Veja o Pulso pelos dois lados.
        </h2>
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {[
            {
              tipo: 'cidadao',
              rotulo: 'Visão do cidadão',
              titulo: 'Qual caminho está mais fresco e iluminado?',
              itens: ['Mapa das 6 ruas com os ônibus medindo ao vivo', 'O número exato da rua onde está o problema', 'Botão para avisar um problema que você viu'],
              botao: 'Abrir a visão do cidadão',
              // Coral com texto escuro (contraste de 6:1)
              cores: { cartao: 'bg-coral text-tinta', texto2: 'text-tinta/80', traco: 'bg-tinta/40', botao: 'bg-tinta text-white hover:bg-black', icone: '#15171B', fundoIcone: '#FFFFFF' },
            },
            {
              tipo: 'agente',
              rotulo: 'Visão do agente da subprefeitura',
              titulo: 'Onde agir primeiro?',
              itens: ['Chamados abertos sozinhos pelos sensores', 'Mapa com cada chamado no lugar exato', 'Fila de atendimento por prioridade e indicadores'],
              botao: 'Abrir a visão do agente',
              // Escuro com texto claro
              cores: { cartao: 'bg-tinta text-white', texto2: 'text-white/75', traco: 'bg-white/40', botao: 'bg-coral text-tinta hover:brightness-110', icone: '#FFFFFF', fundoIcone: '#15171B' },
            },
          ].map((cartao) => (
            <article
              key={cartao.tipo}
              className={`group flex flex-col rounded-3xl p-7 shadow-suave transition hover:-translate-y-1 ${cartao.cores.cartao}`}
            >
              <div className="flex items-start justify-between gap-4">
                <IconePerfil tipo={cartao.tipo} tamanho={64} cor={cartao.cores.icone} fundo={cartao.cores.fundoIcone} />
                <span className={`font-mono text-[11px] tracking-wider uppercase ${cartao.cores.texto2}`}>{cartao.rotulo}</span>
              </div>
              <h3 className="mt-8 text-3xl leading-tight font-medium tracking-tight">{cartao.titulo}</h3>
              <ul className={`mt-5 space-y-2 ${cartao.cores.texto2}`}>
                {cartao.itens.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className={`mt-2.5 h-px w-4 shrink-0 ${cartao.cores.traco}`} />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => aoIr(cartao.tipo)}
                className={`mt-8 min-h-12 self-start rounded-full px-6 font-medium transition ${cartao.cores.botao}`}
              >
                {cartao.botao} <span aria-hidden="true" className="inline-block transition group-hover:translate-x-1">→</span>
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ===== Rodapé: frase final do vídeo, fontes e aviso ===== */}
      <footer className="relative overflow-hidden bg-tinta text-white">
        <div className="mx-auto max-w-7xl px-4 pt-20 pb-10">
          <p className="text-4xl leading-[1.02] font-medium tracking-tighter sm:text-6xl">
            Toda cidade com ônibus
            <span className="block text-coral">pode ter um Pulso.</span>
          </p>

          <div className="mt-16 grid gap-10 border-t border-white/10 pt-10 md:grid-cols-[1fr_2fr]">
            <MarcaPulso escuro grande />
            <div>
              <h2 className="font-mono text-[11px] tracking-[0.18em] text-white/60 uppercase">Fontes dos números</h2>
              <ul className="mt-3 space-y-0.5 text-sm text-white/75">
                {Object.entries(FONTES).map(([id, f]) => (
                  <li key={id}>
                    <a href={f.url} target="_blank" rel="noreferrer" className="inline-block py-1.5 underline decoration-white/30 underline-offset-2 hover:text-white">
                      {f.texto}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-8 font-mono text-[11px] text-white/60">
                Demonstração acadêmica. As leituras dos sensores, os chamados e a numeração das ruas são simulados. O traçado das
                ruas e o mapa vêm do OpenStreetMap. Foto do simulador: do grupo, com as placas borradas. Engenharia de Software · FIAP · Global Solution 2026.
              </p>
            </div>
          </div>
        </div>
        {/* Nome gigante vazado no pé da página (decoração) */}
        <p aria-hidden="true" className="texto-vazado pointer-events-none -mb-8 px-4 text-[9rem] leading-none font-medium tracking-tighter select-none sm:text-[16rem]">
          Pulso
        </p>
      </footer>
    </div>
  )
}

export default Inicio
