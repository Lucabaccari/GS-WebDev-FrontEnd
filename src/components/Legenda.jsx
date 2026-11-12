// Legenda do mapa: o que cada pictograma e cada fita na rua quer dizer.
// Compacta, numa linha só (quebra no celular).
import StatusPicto from './StatusPicto.jsx'

// A amostra de fita imita o desenho do mapa (CamadaPontos).
const ITENS = [
  { estado: 'normal', rotulo: 'Normal', fita: <line x1="0" y1="6" x2="40" y2="6" stroke="#1B1C1E" strokeWidth="4" /> },
  {
    estado: 'atencao',
    rotulo: 'Atenção',
    fita: (
      <>
        <line x1="0" y1="6" x2="40" y2="6" stroke="#FFC400" strokeWidth="8" />
        <line x1="0" y1="6" x2="40" y2="6" stroke="#1B1C1E" strokeWidth="8" strokeDasharray="4 10" />
      </>
    ),
  },
  { estado: 'critico', rotulo: 'Crítico', fita: <line x1="0" y1="6" x2="40" y2="6" stroke="#D7261E" strokeWidth="9" /> },
  {
    estado: 'sem_dados',
    rotulo: 'Sem dados',
    fita: <line x1="0" y1="6" x2="40" y2="6" stroke="#A9A59C" strokeWidth="5" strokeDasharray="2 8" />,
  },
]

function Legenda() {
  return (
    <section aria-label="Legenda do mapa">
      <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {ITENS.map((item) => (
          <li key={item.estado} className="flex items-center gap-2">
            <StatusPicto estado={item.estado} tamanho={18} />
            <svg width="40" height="12" aria-hidden="true">{item.fita}</svg>
            <span className="font-semibold">{item.rotulo}</span>
          </li>
        ))}
      </ul>
      <p className="mt-1 text-xs">
        O sensor mede a cada 100 m. Luz e pavimento (um poste, um buraco) marcam só o lugar exato, com margem de 20
        números. Calor e ar marcam o trecho de 100 m. Numeração simulada.
      </p>
    </section>
  )
}

export default Legenda
