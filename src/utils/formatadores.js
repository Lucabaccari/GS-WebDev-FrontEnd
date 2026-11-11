// Funções puras que transformam dados em texto para a tela.
import { CAMADAS, leituraValida } from './classificar.js'

// Mostra o valor com a unidade, no formato brasileiro (vírgula decimal).
// Ex.: formatarValor('calor', 32.4) -> '32,4 °C'. Leitura inválida -> '—'.
export function formatarValor(camada, valor) {
  if (!leituraValida(camada, valor)) return '—'
  const numero = Number(valor).toLocaleString('pt-BR')
  return `${numero} ${CAMADAS[camada].unidade}`
}
