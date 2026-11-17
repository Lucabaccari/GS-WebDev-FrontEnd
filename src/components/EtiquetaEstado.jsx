// Etiqueta com pictograma + texto do estado (ex.: [octógono] CRÍTICO).
// Junta as 3 pistas do guia: cor, forma e texto.
import StatusPicto from './StatusPicto.jsx'
import { ROTULOS_ESTADO } from '../utils/classificar.js'

// Fundo claro (cor do estado bem suave) com texto escuro da mesma família.
// Todas as combinações têm contraste de 4,5:1 ou mais (o vermelho do texto é mais escuro de propósito).
const CORES = {
  normal: 'bg-normal/10 text-normal',
  atencao: 'bg-atencao/30 text-tinta',
  critico: 'bg-critico/10 text-[#A3160F]',
  sem_dados: 'bg-linha text-tinta-2',
}

function EtiquetaEstado({ estado, grande = false }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <StatusPicto estado={estado} tamanho={grande ? 24 : 16} />
      <span
        className={`rounded-full px-2 font-medium ${CORES[estado]} ${grande ? 'py-0.5 text-sm' : 'py-0.5 text-xs'}`}
      >
        {ROTULOS_ESTADO[estado]}
      </span>
    </span>
  )
}

export default EtiquetaEstado
