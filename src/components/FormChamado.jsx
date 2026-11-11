// Formulário para o cidadão avisar um problema (cria um chamado na API).
// Props:
// - trechos: lista vinda do useLeituras (para escolher o trecho e calcular a prioridade)
// - aoEnviar: função async que recebe os dados do chamado e devolve true se deu certo
// - aoCancelar: fecha o formulário
import { useState } from 'react'
import { CAMADAS } from '../utils/classificar.js'
import { montarChamadoCidadao, validarFormulario } from '../utils/chamados.js'

const CLASSE_CAMPO = 'mt-1 block min-h-11 w-full border-2 border-asfalto bg-white px-3 py-2'

function FormChamado({ trechos, aoEnviar, aoCancelar }) {
  // Cada campo do formulário é um estado ("componente controlado").
  const [trechoId, setTrechoId] = useState('')
  const [tipo, setTipo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [erro, setErro] = useState(null)
  const [enviando, setEnviando] = useState(false)

  async function enviar(evento) {
    evento.preventDefault() // impede o navegador de recarregar a página

    const problema = validarFormulario({ trechoId, tipo, descricao })
    if (problema) {
      setErro(problema)
      return
    }

    setErro(null)
    setEnviando(true)
    const trecho = trechos.find((t) => t.id === Number(trechoId))
    const deuCerto = await aoEnviar(montarChamadoCidadao({ trecho, tipo, descricao }))
    setEnviando(false)
    if (!deuCerto) setErro('Não foi possível enviar. Tente de novo.')
  }

  return (
    <form id="form-chamado" onSubmit={enviar} noValidate className="space-y-4 border-[3px] border-asfalto bg-white p-4 shadow-dura">
      <h2 className="text-xl font-black uppercase [font-stretch:75%]">Avisar um problema</h2>

      <label className="block font-semibold">
        Trecho
        <select value={trechoId} onChange={(e) => setTrechoId(e.target.value)} className={CLASSE_CAMPO}>
          <option value="">Escolha o trecho</option>
          {trechos.map((t) => (
            <option key={t.id} value={t.id}>
              {t.id}. {t.nome}
            </option>
          ))}
        </select>
      </label>

      <label className="block font-semibold">
        Tipo do problema
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} className={CLASSE_CAMPO}>
          <option value="">Escolha o tipo</option>
          {Object.entries(CAMADAS).map(([id, regra]) => (
            <option key={id} value={id}>
              {regra.nome}
            </option>
          ))}
        </select>
      </label>

      <label className="block font-semibold">
        O que está acontecendo?
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          maxLength={140}
          rows={3}
          placeholder="Ex.: Poste apagado na esquina."
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
