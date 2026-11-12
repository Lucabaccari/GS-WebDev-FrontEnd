// Funções puras que transformam dados em texto para a tela.
import { CAMADAS, leituraValida } from './classificar.js'

// Mostra o valor com a unidade, no formato brasileiro (vírgula decimal).
// Ex.: formatarValor('calor', 32.4) -> '32,4 °C'. Leitura inválida -> '—'.
export function formatarValor(camada, valor) {
  if (!leituraValida(camada, valor)) return '—'
  const numero = Number(valor).toLocaleString('pt-BR')
  return `${numero} ${CAMADAS[camada].unidade}`
}

// Número de protocolo do bilhete a partir do id do MockAPI. Ex.: 7 -> 'PL-000007'.
export function formatarProtocolo(id) {
  return 'PL-' + String(id).padStart(6, '0')
}

// Data e hora no formato brasileiro. Ex.: '11/11/2026, 14:05'. Vazio -> '—'.
export function formatarDataHora(iso) {
  if (!iso) return '—'
  const data = new Date(iso)
  if (Number.isNaN(data.getTime())) return '—'
  return data.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

// Duração em minutos para texto. Ex.: 0.4 -> 'menos de 1 min' | 75 -> '1 h 15 min'. null -> '—'.
export function formatarDuracao(minutos) {
  if (minutos === null || minutos === undefined) return '—'
  if (minutos < 1) return 'menos de 1 min'
  const total = Math.round(minutos)
  const horas = Math.floor(total / 60)
  const resto = total % 60
  if (horas === 0) return `${resto} min`
  return `${horas} h ${resto} min`
}

// Tempo curto no formato de relógio. Ex.: 75000 ms -> '1:15' | 9000 ms -> '0:09'.
// Arredonda para cima: faltando 0,4 s ainda mostra '0:01'.
export function formatarRelogio(ms) {
  const segundos = Math.max(0, Math.ceil(ms / 1000))
  const minutos = Math.floor(segundos / 60)
  const resto = String(segundos % 60).padStart(2, '0')
  return `${minutos}:${resto}`
}
