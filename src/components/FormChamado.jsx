// Formulário para o cidadão avisar um problema (cria um chamado na API).
// Três listas de seleção, uma embaixo da outra: 1) a rua, 2) o trecho dessa rua, 3) o tipo do problema; e a descrição.
// O trecho só aparece depois de escolher a rua, e mostra os trechos de 100 m daquela rua.
//
// Props:
// - ruas: lista vinda do useLeituras (com os pontos, estados e locais de cada rua)
// - pontoInicialId: ponto já escolhido no mapa ou no painel (pode ser vazio)
// - aoEnviar: função async que recebe os dados do chamado e devolve true se deu certo
// - aoCancelar: fecha o formulário
import { useState } from 'react'
import StatusPicto from './StatusPicto.jsx'
import { ROTULOS_ESTADO, CAMADAS } from '../utils/classificar.js'
import { montarChamadoCidadao, validarFormulario, TIPOS_DE_PROBLEMA } from '../utils/chamados.js'

const CLASSE_CAMPO = 'mt-1 block min-h-11 w-full border-2 border-asfalto bg-white px-3 py-2 disabled:bg-concreto'

// Texto de um trecho na lista. Se o sensor achou algo ali, já avisa (ex.: "— Luz à noite: crítico").
function textoDoTrecho(ponto) {
  const problemas = Object.keys(CAMADAS).filter((c) => ponto.estados[c] === 'atencao' || ponto.estados[c] === 'critico')
  if (problemas.length === 0) return ponto.nome
  return `${ponto.nome} — ${problemas.map((c) => `${CAMADAS[c].nome}: ${ROTULOS_ESTADO[ponto.estados[c]].toLowerCase()}`).join(', ')}`
}

function FormChamado({ ruas, pontoInicialId = '', aoEnviar, aoCancelar }) {
  const pontoInicial = ruas.flatMap((r) => r.pontos).find((p) => p.id === pontoInicialId)

  // Cada campo do formulário é um estado ("componente controlado").
  const [ruaId, setRuaId] = useState(pontoInicial ? String(pontoInicial.ruaId) : '')
  const [pontoId, setPontoId] = useState(pontoInicialId)
  const [tipo, setTipo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [erro, setErro] = useState(null)
  const [enviando, setEnviando] = useState(false)

  const rua = ruas.find((r) => r.id === Number(ruaId))
  const ponto = rua?.pontos.find((p) => p.id === pontoId)
  // Se o sensor já registrou esse mesmo tipo de problema no trecho, mostramos para o cidadão.
  const jaRegistrado = ponto && tipo && ponto.estados[tipo] && ['atencao', 'critico'].includes(ponto.estados[tipo])

  // Trocar a rua apaga o trecho escolhido (os trechos são de outra rua).
  function mudarRua(novaRuaId) {
    setRuaId(novaRuaId)
    setPontoId('')
  }

  async function enviar(evento) {
    evento.preventDefault() // impede o navegador de recarregar a página

    const problema = validarFormulario({ ruaId, pontoId, tipo, descricao })
    if (problema) {
      setErro(problema)
      return
    }

    setErro(null)
    setEnviando(true)
    const deuCerto = await aoEnviar(montarChamadoCidadao({ ponto, tipo, descricao }))
    setEnviando(false)
    if (!deuCerto) setErro('Não foi possível enviar. Tente de novo.')
  }

  return (
    <form id="form-chamado" onSubmit={enviar} noValidate className="space-y-4 border-[3px] border-asfalto bg-white p-4 shadow-dura">
      <div>
        <h2 className="text-xl font-black uppercase [font-stretch:75%]">Avisar um problema</h2>
        <p className="text-sm">Conte o que você viu. A subprefeitura recebe o aviso no painel dela.</p>
      </div>

      <label className="block font-semibold">
        1. Rua
        <select value={ruaId} onChange={(e) => mudarRua(e.target.value)} className={CLASSE_CAMPO}>
          <option value="">Escolha a rua</option>
          {ruas.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nome}
            </option>
          ))}
        </select>
      </label>

      <label className="block font-semibold">
        2. Trecho {rua && <span className="font-normal">({rua.pontos.length} trechos de 100 m)</span>}
        <select value={pontoId} onChange={(e) => setPontoId(e.target.value)} disabled={!rua} className={CLASSE_CAMPO}>
          <option value="">{rua ? 'Escolha o trecho' : 'Escolha a rua primeiro'}</option>
          {rua?.pontos.map((p) => (
            <option key={p.id} value={p.id}>
              {textoDoTrecho(p)}
            </option>
          ))}
        </select>
      </label>

      <label className="block font-semibold">
        3. Tipo do problema
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} className={CLASSE_CAMPO}>
          <option value="">Escolha o tipo</option>
          {TIPOS_DE_PROBLEMA.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nome}
            </option>
          ))}
        </select>
      </label>

      {jaRegistrado && (
        <p className="flex items-center gap-2 border-l-4 border-asfalto bg-atencao/20 px-3 py-2 text-sm">
          <StatusPicto estado={ponto.estados[tipo]} tamanho={18} />
          O sensor do ônibus também registrou {CAMADAS[tipo].nome.toLowerCase()} {ROTULOS_ESTADO[ponto.estados[tipo]].toLowerCase()} no{' '}
          {ponto.locais[tipo].nome}. Seu aviso ajuda a confirmar.
        </p>
      )}

      <label className="block font-semibold">
        O que está acontecendo?
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          maxLength={140}
          rows={3}
          placeholder={tipo === 'outros' ? 'Ex.: Lixo acumulado na calçada.' : 'Ex.: Poste apagado na esquina.'}
          className={CLASSE_CAMPO}
        />
        <span className="text-sm font-normal">{descricao.length}/140</span>
      </label>

      {/* role="alert": o leitor de tela lê o erro assim que ele aparece */}
      {erro && (
        <p role="alert" className="border-2 border-asfalto bg-critico px-3 py-2 font-bold text-white">
          {erro}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={enviando}
          className="min-h-11 border-2 border-asfalto bg-asfalto px-5 font-bold text-white uppercase disabled:opacity-60"
        >
          {enviando ? 'Enviando...' : 'Enviar aviso'}
        </button>
        <button type="button" onClick={aoCancelar} className="min-h-11 border-2 border-asfalto bg-white px-5 font-bold uppercase">
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default FormChamado
