// Painel da rua escolhida.
// - Em cima: as ocorrências (lugares em atenção ou crítico), com a numeração exata.
// - Embaixo, numa caixa que abre e fecha: todos os pontos de medição (a cada 100 m),
//   numa faixa vertical como as estações de uma linha de metrô.
// Clicar num ponto abre o detalhe das 4 leituras e o botão "Avisar problema aqui".
//
// Props: rua, camada, pontoSelecionadoId, aoSelecionarPonto(ponto), aoAvisar(ponto),
// onibus (estado do ônibus desta rua, do useOnibus).
import StatusPicto from './StatusPicto.jsx'
import EtiquetaEstado from './EtiquetaEstado.jsx'
import { CAMADAS, ROTULOS_ESTADO, estadoDoPonto, resumirRua, textoResumo } from '../utils/classificar.js'
import { formatarValor } from '../utils/formatadores.js'
import { PASSAGENS_PARA_CHAMADO } from '../utils/regras.js'

// Fundo leve da linha conforme o estado do ponto (o texto continua escuro: bom contraste).
const FUNDO = {
  normal: '',
  atencao: 'bg-atencao/20',
  critico: 'bg-critico/10',
  sem_dados: 'bg-asfalto/5',
}

// Lista das ocorrências de um ponto: uma para cada camada em atenção ou crítico.
// Na camada "Geral" olha as 4; senão, só a camada escolhida.
function ocorrenciasDoPonto(ponto, camada) {
  const camadas = camada === 'geral' ? Object.keys(CAMADAS) : [camada]
  return camadas
    .filter((c) => ponto.estados[c] === 'atencao' || ponto.estados[c] === 'critico')
    .map((c) => ({ ponto, camada: c, estado: ponto.estados[c], local: ponto.locais[c] }))
}

// Uma linha da faixa de pontos (botão que abre o detalhe).
function LinhaPonto({ ponto, camada, aberto, sensorAqui, aoSelecionar, aoAvisar }) {
  const estado = estadoDoPonto(ponto, camada)
  const sequencia = Math.max(...Object.values(ponto.sequencias))

  return (
    <li className={`relative ${FUNDO[estado]}`}>
      <button
        type="button"
        aria-expanded={aberto}
        onClick={() => aoSelecionar(ponto)}
        className="flex min-h-11 w-full items-center gap-3 py-1.5 pr-2 pl-0 text-left"
      >
        {/* Pictograma "pendurado" na linha, como uma estação */}
        <span className="-ml-[13px] flex h-[22px] w-[22px] shrink-0 items-center justify-center bg-white">
          <StatusPicto estado={estado} tamanho={18} />
        </span>
        <span className="flex flex-1 flex-wrap items-center gap-2 text-sm">
          <span className="font-bold tabular-nums">{ponto.nome}</span>
          <span>{ROTULOS_ESTADO[estado]}</span>
          {sensorAqui && <span className="bg-painel px-1.5 font-letreiro text-xs text-ambar uppercase">Sensor aqui</span>}
        </span>
        <span aria-hidden="true">{aberto ? '−' : '+'}</span>
      </button>

      {aberto && (
        <div className="mb-2 ml-3 border-2 border-asfalto bg-white p-3">
          <dl className="space-y-1.5">
            {Object.keys(CAMADAS).map((c) => (
              <div key={c} className="flex items-center justify-between gap-2 text-sm">
                <dt className="font-semibold">{CAMADAS[c].nome}</dt>
                <dd className="flex items-center gap-2">
                  <span className="tabular-nums">{formatarValor(c, ponto.leituras[c])}</span>
                  <EtiquetaEstado estado={ponto.estados[c]} />
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-2 text-xs">Leitura nº {ponto.passagens} deste trecho (uma a cada passagem do ônibus).</p>

          {/* Contagem da regra do chamado automático neste ponto */}
          {sequencia > 0 && (
            <p className="mt-2 border-l-4 border-critico pl-2 text-sm font-semibold">
              {sequencia >= PASSAGENS_PARA_CHAMADO
                ? `Crítico há ${sequencia} passagens. Limite para chamado automático atingido.`
                : `Crítico há ${sequencia} de ${PASSAGENS_PARA_CHAMADO} passagens para abrir chamado.`}
            </p>
          )}

          <button
            type="button"
            onClick={() => aoAvisar(ponto)}
            className="mt-3 min-h-11 w-full border-2 border-asfalto bg-critico px-3 font-bold text-white"
          >
            Avisar problema aqui
          </button>
        </div>
      )}
    </li>
  )
}

function PainelRua({ rua, camada, pontoSelecionadoId, aoSelecionarPonto, aoAvisar, onibus }) {
  const resumo = resumirRua(rua, camada)
  const ocorrencias = rua.pontos.flatMap((p) => ocorrenciasDoPonto(p, camada))
  // O ponto onde o ônibus está agora (o sensor está medindo ali).
  const pontoDoOnibus = rua.pontos.find((p) => onibus.numero > p.inicioM && onibus.numero <= p.fimM)

  return (
    <section aria-labelledby="titulo-rua" className="space-y-4">
      <header className="border-b-2 border-asfalto pb-3">
        <h2 id="titulo-rua" className="text-2xl leading-none font-black uppercase [font-stretch:75%]">
          {rua.nome}
        </h2>
        <p className="mt-1 text-sm">
          {textoResumo(resumo)} · um a cada 100 m · {(rua.comprimentoM / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} km
        </p>
      </header>

      <div>
        <h3 className="mb-2 text-sm font-bold uppercase">Ocorrências</h3>
        {ocorrencias.length === 0 ? (
          <p className="border-2 border-dashed border-asfalto/40 p-3 text-sm">Nenhum problema nesta rua agora.</p>
        ) : (
          <ul className="space-y-2">
            {ocorrencias.map((o) => (
              <li key={`${o.ponto.id}-${o.camada}`}>
                <button
                  type="button"
                  onClick={() => aoSelecionarPonto(o.ponto)}
                  className={`flex min-h-11 w-full items-center gap-3 border-2 p-2 text-left ${
                    o.estado === 'critico' ? 'border-critico bg-critico/10' : 'border-asfalto bg-atencao/20'
                  }`}
                >
                  <StatusPicto estado={o.estado} tamanho={24} />
                  <span className="flex-1">
                    <span className="block font-bold tabular-nums">
                      {rua.nome}, {o.local.nome}
                    </span>
                    <span className="block text-sm">
                      {CAMADAS[o.camada].nome}: {formatarValor(o.camada, o.ponto.leituras[o.camada])} · {ROTULOS_ESTADO[o.estado]}
                      {o.local.deLugar ? ' · lugar exato' : ' · trecho de 100 m'}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* <details> abre e fecha sozinho. Começa aberto se algum ponto foi escolhido. */}
      <details open={Boolean(pontoSelecionadoId)}>
        <summary className="flex min-h-11 cursor-pointer items-center text-sm font-bold uppercase">
          Todos os {rua.pontos.length} pontos de medição
        </summary>
        <ol className="mt-2 border-l-4 border-asfalto">
          {rua.pontos.map((ponto) => (
            <LinhaPonto
              key={ponto.id}
              ponto={ponto}
              camada={camada}
              aberto={ponto.id === pontoSelecionadoId}
              sensorAqui={ponto.id === pontoDoOnibus?.id}
              aoSelecionar={aoSelecionarPonto}
              aoAvisar={aoAvisar}
            />
          ))}
        </ol>
      </details>
    </section>
  )
}

export default PainelRua
