// Simulação das leituras dos sensores (não existe hardware de verdade nesta demo).
// A cada "passagem" do ônibus, cada trecho recebe um valor novo para cada camada.
//
// Os perfis abaixo são INVENTADOS para a demonstração: só servem para que cada
// trecho tenha um comportamento diferente e os 3 estados apareçam na tela.

// Valor "típico" de cada camada em cada trecho (id do trecho -> valores).
const PERFIS = {
  1: { calor: 33, luz: 40, pavimento: 1.2, ar: 30 },
  2: { calor: 31, luz: 12, pavimento: 1.6, ar: 22 },
  3: { calor: 36, luz: 25, pavimento: 1.3, ar: 55 },
  4: { calor: 29, luz: 30, pavimento: 2.1, ar: 45 },
  5: { calor: 27, luz: 1, pavimento: 1.0, ar: 18 }, // rua escura: fica crítica quase sempre
  6: { calor: 34, luz: 18, pavimento: 1.8, ar: 35 },
}

// Quanto o valor pode variar para cima ou para baixo a cada passagem.
const VARIACAO = { calor: 3, luz: 3, pavimento: 0.4, ar: 12 }

// Chance de o sensor falhar e mandar uma leitura inválida (5%).
const CHANCE_FALHA = 0.05

// Número aleatório entre -1 e 1.
function aleatorio() {
  return Math.random() * 2 - 1
}

// Gera a leitura de UMA camada de UM trecho.
function gerarValor(trechoId, camada) {
  if (Math.random() < CHANCE_FALHA) return null // sensor falhou: sem dados

  const base = PERFIS[trechoId][camada]
  const valor = base + aleatorio() * VARIACAO[camada]
  const positivo = Math.max(0, valor) // nenhuma dessas medidas é negativa

  // Pavimento usa 2 casas decimais (ex.: 1,75 g). O resto usa 1 casa.
  const casas = camada === 'pavimento' ? 2 : 1
  return Number(positivo.toFixed(casas))
}

// Gera as leituras de uma passagem para todos os trechos.
// Devolve um objeto assim: { 1: { calor: 32.4, luz: 41, pavimento: 1.1, ar: 28 }, 2: {...}, ... }
export function gerarPassagem(trechos) {
  const leituras = {}
  for (const trecho of trechos) {
    leituras[trecho.id] = {
      calor: gerarValor(trecho.id, 'calor'),
      luz: gerarValor(trecho.id, 'luz'),
      pavimento: gerarValor(trecho.id, 'pavimento'),
      ar: gerarValor(trecho.id, 'ar'),
    }
  }
  return leituras
}

// Velocidades do modo demonstração (tempo entre uma passagem e outra).
export const VELOCIDADES = [
  { id: 'lenta', rotulo: 'Lenta', intervaloMs: 8000 },
  { id: 'normal', rotulo: 'Normal', intervaloMs: 4000 },
  { id: 'rapida', rotulo: 'Rápida', intervaloMs: 1500 },
]
