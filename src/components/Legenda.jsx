// Legenda dos estados: explica o que cada forma, fita e cor quer dizer.
import FitaEstado from './FitaEstado.jsx'
import EtiquetaEstado from './EtiquetaEstado.jsx'

const ITENS = [
  { estado: 'normal', texto: 'Visto e fita lisa. Siga normalmente.' },
  { estado: 'atencao', texto: 'Losango e fita listrada. Fique atento.' },
  { estado: 'critico', texto: 'Octógono e fita diagonal. Evite agora.' },
  { estado: 'sem_dados', texto: 'Tracejado. O sensor não mandou leitura válida.' },
]

function Legenda() {
  return (
    <section aria-labelledby="titulo-legenda" className="border-2 border-asfalto bg-white p-3">
      <h2 id="titulo-legenda" className="mb-2 text-sm font-bold uppercase">Legenda</h2>
      <ul className="space-y-3">
        {ITENS.map((item) => (
          <li key={item.estado}>
            <EtiquetaEstado estado={item.estado} />
            <div className="mt-1 w-16">
              <FitaEstado estado={item.estado} altura={8} />
            </div>
            <p className="mt-1 text-sm">{item.texto}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Legenda
