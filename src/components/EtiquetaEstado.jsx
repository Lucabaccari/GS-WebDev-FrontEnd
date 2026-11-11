// Etiqueta com pictograma + texto do estado (ex.: [octógono] CRÍTICO).
// Junta as 3 pistas do guia: cor, forma e texto.
import StatusPicto from './StatusPicto.jsx'
import { ROTULOS_ESTADO } from '../utils/classificar.js'

// Cor de fundo e do texto de cada estado. Todas com contraste de 4,5:1 ou mais.
const CORES = {
  normal: 'bg-normal text-white',
  atencao: 'bg-atencao text-asfalto',
  critico: 'bg-critico text-white',
  sem_dados: 'bg-[#D6D2C9] text-asfalto',
}

function EtiquetaEstado({ estado, grande = false }) {
  return (
    <span className="inline-flex items-center gap-2">
      <StatusPicto estado={estado} tamanho={grande ? 32 : 20} />
      <span
        className={`border-2 border-asfalto px-2 font-bold uppercase ${CORES[estado]} ${
          grande ? 'py-1 text-base' : 'py-0.5 text-xs'
        }`}
      >
        {ROTULOS_ESTADO[estado]}
      </span>
    </span>
  )
}

export default EtiquetaEstado
