// Simulação das leituras dos sensores (não existe hardware de verdade nesta demo).
// Cada vez que um ônibus passa por um ponto de medição, o sensor lê as 4 camadas daquele ponto.
//
// Os números abaixo são INVENTADOS para a demonstração. Quase toda a rua fica normal
// e só alguns lugares têm problema, como acontece na vida real.
import { buscarPonto, pontoNoMetro } from '../data/ruas.js'

// Valor típico de um lugar sem problema (vale para todas as ruas).
const BASE = { calor: 26, luz: 40, pavimento: 1.0, ar: 18 }

// Lugares com problema. "metro" é a distância desde o começo da rua (= a numeração simulada).
// O ponto de medição que cobre aquele metro passa a ler o "valor" naquela camada.
export const PROBLEMAS = [
  { ruaId: 1, camada: 'calor', metro: 1240, valor: 36.5 }, // Av. Paulista: trecho sem sombra (crítico)
  { ruaId: 1, camada: 'pavimento', metro: 2216, valor: 2.2 }, // Av. Paulista: buraco (crítico)
  { ruaId: 2, camada: 'luz', metro: 1862, valor: 12 }, // R. Augusta: pouca luz (atenção)
  { ruaId: 3, camada: 'ar', metro: 640, valor: 56 }, // R. da Consolação: ar poluído (crítico)
  { ruaId: 4, camada: 'pavimento', metro: 764, valor: 2.3 }, // Av. Rebouças: buraco (crítico)
  { ruaId: 4, camada: 'luz', metro: 1934, valor: 3.5 }, // Av. Rebouças: poste apagado (crítico)
  { ruaId: 5, camada: 'luz', metro: 1046, valor: 1 }, // R. Oscar Freire: trecho escuro (crítico)
  { ruaId: 6, camada: 'pavimento', metro: 522, valor: 1.75 }, // Av. Brig. Luís Antônio: piso irregular (atenção)
]

// Luz e pavimento são problemas de UM lugar (um poste, um buraco): o app mostra só aquele lugar,
// com margem de 20 números. Calor e ar se espalham: o app mostra o trecho de 100 m do ponto.
export const CAMADAS_DE_LUGAR = ['luz', 'pavimento']
const MARGEM_NUMEROS = 10 // 10 para cada lado = 20 números

// Quanto o valor pode variar para cima ou para baixo a cada leitura.
const VARIACAO = { calor: 1.5, luz: 3, pavimento: 0.2, ar: 5 }

// Chance de o sensor falhar e mandar uma leitura inválida (2%).
const CHANCE_FALHA = 0.02

const CAMADAS_IDS = ['calor', 'luz', 'pavimento', 'ar']

// Número aleatório entre -1 e 1.
function aleatorio() {
  return Math.random() * 2 - 1
}

// Procura um problema simulado dentro do trecho de um ponto, numa camada. Ou null.
export function problemaNoPonto(ponto, camada) {
  return (
    PROBLEMAS.find(
      (p) => p.ruaId === ponto.ruaId && p.camada === camada && p.metro >= ponto.inicioM && p.metro < ponto.fimM,
    ) || null
  )
}

// Onde exatamente está a ocorrência de uma camada num ponto.
// - luz e pavimento: 20 números em volta do lugar do problema (ex.: nº 1036 a 1056)
// - calor e ar (ou sem lugar conhecido): o trecho inteiro do ponto (ex.: nº 1201 a 1300)
// Devolve { numeroDe, numeroAte, inicioM, fimM }.
export function localDaOcorrencia(ponto, camada) {
  const problema = problemaNoPonto(ponto, camada)
  if (problema && CAMADAS_DE_LUGAR.includes(camada)) {
    return {
      numeroDe: problema.metro - MARGEM_NUMEROS,
      numeroAte: problema.metro + MARGEM_NUMEROS,
      inicioM: problema.metro - MARGEM_NUMEROS,
      fimM: problema.metro + MARGEM_NUMEROS,
    }
  }
  return { numeroDe: ponto.numeroDe, numeroAte: ponto.numeroAte, inicioM: ponto.inicioM, fimM: ponto.fimM }
}

// Gera a leitura de UMA camada de UM ponto.
function gerarValor(ponto, camada) {
  if (Math.random() < CHANCE_FALHA) return null // sensor falhou: sem dados

  // Se há um problema neste trecho, nesta camada, usa o valor do problema. Senão, o valor base.
  const base = problemaNoPonto(ponto, camada)?.valor ?? BASE[camada]
  const valor = Math.max(0, base + aleatorio() * VARIACAO[camada]) // nenhuma medida é negativa

  // Pavimento usa 2 casas decimais (ex.: 1,75 g). O resto usa 1 casa.
  const casas = camada === 'pavimento' ? 2 : 1
  return Number(valor.toFixed(casas))
}

// Gera a leitura das 4 camadas de UM ponto (o que o sensor mede quando o ônibus passa ali).
// Devolve um objeto assim: { calor: 26.4, luz: 41, pavimento: 1.1, ar: 17 }
export function gerarLeituraPonto(pontoId) {
  const ponto = buscarPonto(pontoId)
  const leitura = {}
  for (const camada of CAMADAS_IDS) {
    leitura[camada] = gerarValor(ponto, camada)
  }
  return leitura
}

// Gera leituras para todos os pontos de uma vez.
// Usado só quando o app abre, como se fosse a passagem anterior dos ônibus.
export function gerarPassagem(pontos) {
  const leituras = {}
  for (const ponto of pontos) {
    leituras[ponto.id] = gerarLeituraPonto(ponto.id)
  }
  return leituras
}

// Confere se todo problema simulado cai dentro de algum ponto (usado nos testes).
export function problemasValidos() {
  return PROBLEMAS.every((p) => pontoNoMetro(p.ruaId, p.metro))
}

// Velocidades do modo demonstração. fator 1 = tempo real da simulação (3 minutos por passagem).
export const VELOCIDADES = [
  { id: '1x', rotulo: '1x', fator: 1 },
  { id: '2x', rotulo: '2x', fator: 2 },
  { id: '5x', rotulo: '5x', fator: 5 },
  { id: '10x', rotulo: '10x', fator: 10 },
]
