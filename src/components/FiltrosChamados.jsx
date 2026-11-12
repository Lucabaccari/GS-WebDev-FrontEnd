// Filtros da lista de chamados: status, tipo e rua.
// Props: filtros ({ status, tipo, trechoId }) e aoMudar (recebe o objeto de filtros novo).
// (Na API o campo da rua se chama "trechoId", por isso o filtro usa esse nome.)
import { ROTULOS_STATUS, FILTROS_VAZIOS, TIPOS_DE_PROBLEMA } from '../utils/chamados.js'
import { RUAS } from '../data/ruas.js'

const CLASSE_CAMPO = 'mt-1 block min-h-11 w-full border-2 border-asfalto bg-white px-2'

function FiltrosChamados({ filtros, aoMudar }) {
  // Troca só um campo e mantém os outros (o "..." copia o objeto).
  function mudar(campo, valor) {
    aoMudar({ ...filtros, [campo]: valor })
  }

  return (
    <fieldset className="grid grid-cols-2 items-end gap-3 border-2 border-asfalto bg-white p-3">
      <legend className="px-1 text-sm font-bold uppercase">Filtrar chamados</legend>

      <label className="text-sm font-semibold">
        Status
        <select value={filtros.status} onChange={(e) => mudar('status', e.target.value)} className={CLASSE_CAMPO}>
          <option value="">Todos</option>
          {Object.entries(ROTULOS_STATUS).map(([id, rotulo]) => (
            <option key={id} value={id}>{rotulo}</option>
          ))}
        </select>
      </label>

      <label className="text-sm font-semibold">
        Tipo
        <select value={filtros.tipo} onChange={(e) => mudar('tipo', e.target.value)} className={CLASSE_CAMPO}>
          <option value="">Todos</option>
          {TIPOS_DE_PROBLEMA.map((t) => (
            <option key={t.id} value={t.id}>{t.nome}</option>
          ))}
        </select>
      </label>

      <label className="text-sm font-semibold">
        Rua
        <select value={filtros.trechoId} onChange={(e) => mudar('trechoId', e.target.value)} className={CLASSE_CAMPO}>
          <option value="">Todas</option>
          {RUAS.map((rua) => (
            <option key={rua.id} value={rua.id}>{rua.nome}</option>
          ))}
        </select>
      </label>

      <button type="button" onClick={() => aoMudar(FILTROS_VAZIOS)} className="min-h-11 border-2 border-asfalto bg-white px-3 text-sm font-bold">
        Limpar
      </button>
    </fieldset>
  )
}

export default FiltrosChamados
