// "Verifique seu caminho" (plano B), na tela do Cidadão.
// A pessoa monta o caminho: escolhe uma ou mais ruas (até 4) e, em cada uma, de qual número
// até qual número vai passar. Ao verificar, o app mostra se há alerta nesses trechos agora,
// com o local exato, e dá um conselho ("Pode seguir", "Siga com cuidado" ou "Evite").
// Na vida real, o caminho seria calculado sozinho pela origem e pelo destino (plano A).
// A conta fica em utils/caminho.js; aqui só tem a tela.
//
// Props: ruas (com os estados atuais, do useLeituras) e aoVerNoMapa(ponto).
import { useState } from 'react'
import StatusPicto from './StatusPicto.jsx'
import IconeProblema from './IconeProblema.jsx'
import { verificarCaminho, conselhoDoCaminho } from '../utils/caminho.js'
import { CAMADAS, ROTULOS_ESTADO } from '../utils/classificar.js'

const MAX_TRECHOS = 4
const CAMPO = 'mt-1 block min-h-11 w-full rounded-lg border border-linha bg-white px-2 text-sm'

// Cor da caixa do resultado (sempre junto com o pictograma e o texto, nunca só a cor).
const FUNDO_RESULTADO = {
  normal: 'border-normal/50 bg-normal/5',
  atencao: 'border-[#B58800] bg-atencao/15',
  critico: 'border-critico/60 bg-critico/5',
}

let proximaChave = 1 // identifica cada linha da lista (para o React e para os ids dos campos)
function novoTrecho() {
  return { chave: proximaChave++, ruaId: '', deM: '', ateM: '' }
}

function VerificarCaminho({ ruas, aoVerNoMapa }) {
  const [trechos, setTrechos] = useState(() => [novoTrecho()])
  const [verificado, setVerificado] = useState(false)

  // Muda um campo de uma linha. Mexeu no caminho: o resultado antigo some até verificar de novo.
  function mudar(chave, campos) {
    setTrechos(trechos.map((t) => (t.chave === chave ? { ...t, ...campos } : t)))
    setVerificado(false)
  }

  // Ao escolher a rua, já preenche a rua inteira (do primeiro ao último número).
  function escolherRua(chave, ruaId) {
    const rua = ruas.find((r) => r.id === Number(ruaId))
    mudar(chave, rua ? { ruaId: rua.id, deM: rua.pontos[0].inicioM, ateM: rua.pontos.at(-1).fimM } : { ruaId: '', deM: '', ateM: '' })
  }

  function remover(chave) {
    setTrechos(trechos.filter((t) => t.chave !== chave))
    setVerificado(false)
  }

  const completos = trechos.filter((t) => t.ruaId !== '')
  const podeVerificar = completos.length > 0 && completos.length === trechos.length
  // O resultado usa as leituras de agora: se o ônibus passar e a leitura mudar, ele acompanha.
  const resultado = verificado ? verificarCaminho(completos, ruas) : null

  return (
    <section aria-labelledby="titulo-caminho" className="rounded-2xl border border-linha bg-white p-4 shadow-suave md:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <h2 id="titulo-caminho" className="text-2xl font-semibold tracking-tight">
          Verifique seu caminho
        </h2>
        
      </div>
      <p className="mt-1 max-w-3xl text-sm text-tinta-2">
        Escolha as ruas e os números por onde você vai passar. O Pulso confere se há alerta nesses trechos agora. Na vida
        real, o app calcularia o caminho sozinho, pela sua origem e pelo seu destino.
      </p>

      <ol className="mt-4 space-y-3">
        {trechos.map((t, i) => {
          const rua = ruas.find((r) => r.id === t.ruaId)
          const id = `caminho-${t.chave}`
          return (
            <li key={t.chave} className="grid gap-2 rounded-xl border border-linha p-3 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
              <label htmlFor={`${id}-rua`} className="text-xs font-semibold">
                {i + 1}ª rua
                <select id={`${id}-rua`} value={t.ruaId} onChange={(e) => escolherRua(t.chave, e.target.value)} className={CAMPO}>
                  <option value="">Escolha a rua</option>
                  {ruas.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nome}
                    </option>
                  ))}
                </select>
              </label>

              {/* De e até: os números dos trechos de 100 m da rua escolhida */}
              <div className="grid grid-cols-2 gap-2 sm:contents">
                <label htmlFor={`${id}-de`} className="text-xs font-semibold">
                  Do número
                  <select id={`${id}-de`} value={t.deM} disabled={!rua} onChange={(e) => mudar(t.chave, { deM: Number(e.target.value) })} className={CAMPO}>
                    {rua?.pontos.map((p) => (
                      <option key={p.id} value={p.inicioM}>
                        nº {p.numeroDe}
                      </option>
                    ))}
                  </select>
                </label>
                <label htmlFor={`${id}-ate`} className="text-xs font-semibold">
                  Até o número
                  <select id={`${id}-ate`} value={t.ateM} disabled={!rua} onChange={(e) => mudar(t.chave, { ateM: Number(e.target.value) })} className={CAMPO}>
                    {rua?.pontos.map((p) => (
                      <option key={p.id} value={p.fimM}>
                        nº {p.numeroAte}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {trechos.length > 1 && (
                <button
                  type="button"
                  onClick={() => remover(t.chave)}
                  className="min-h-11 rounded-lg border border-linha px-3 text-sm font-medium hover:border-critico hover:text-critico"
                >
                  Tirar
                </button>
              )}
            </li>
          )
        })}
      </ol>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTrechos([...trechos, novoTrecho()])}
          disabled={trechos.length >= MAX_TRECHOS}
          className="min-h-11 rounded-full border border-linha-forte px-4 text-sm font-medium hover:border-tinta disabled:opacity-50"
        >
          + Adicionar outra rua
        </button>
        <button
          type="button"
          onClick={() => setVerificado(true)}
          disabled={!podeVerificar}
          className="min-h-11 rounded-full bg-tinta px-5 text-sm font-medium text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          Verificar caminho
        </button>
      </div>

      {/* Resultado. aria-live: o leitor de tela lê o conselho quando ele aparece. */}
      <div aria-live="polite">
        {resultado && (
          <div className={`surgir mt-4 rounded-xl border p-4 ${FUNDO_RESULTADO[resultado.pior]}`}>
            <p className="flex items-center gap-2 font-semibold">
              <StatusPicto estado={resultado.pior} tamanho={22} />
              {conselhoDoCaminho(resultado)}
            </p>

            <ul className="mt-3 space-y-3">
              {resultado.porTrecho.map((trecho, i) => (
                <li key={`${trecho.ruaId}-${i}`}>
                  <p className="text-sm font-semibold">{trecho.ruaNome}</p>
                  {trecho.alertas.length === 0 ? (
                    <p className="text-sm text-tinta-2">Sem alertas neste trecho.</p>
                  ) : (
                    <ul className="mt-1 space-y-1.5">
                      {trecho.alertas.map((a) => (
                        <li key={a.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                          <IconeProblema tipo={a.camada} tamanho={24} />
                          <span className="min-w-0 flex-1">
                            {CAMADAS[a.camada].nome} · {a.local}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-tinta-2">
                            <StatusPicto estado={a.estado} tamanho={14} />
                            {ROTULOS_ESTADO[a.estado]}
                          </span>
                          <button type="button" onClick={() => aoVerNoMapa(a.ponto)} className="min-h-11 text-sm font-medium underline underline-offset-2">
                            Ver no mapa
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-3 font-mono text-[11px] text-tinta-2">Leituras de agora · dados simulados</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default VerificarCaminho
