// Regras de negócio do Pulso: transforma o número lido pelo sensor em um estado.
// Funções puras: recebem dados e devolvem um resultado, sem tocar na tela nem na API.
//
// ATENÇÃO: os limites vêm do PDF do Pulso e ainda precisam ser confirmados
// nas fontes (INMET, CETESB, SP156, GeoSampa). Se mudarem, mude só aqui.

// Os 4 estados possíveis de um trecho.
export const ESTADOS = {
  NORMAL: 'normal',
  ATENCAO: 'atencao',
  CRITICO: 'critico',
  SEM_DADOS: 'sem_dados',
}

// Texto curto de cada estado, para mostrar na interface.
export const ROTULOS_ESTADO = {
  normal: 'Normal',
  atencao: 'Atenção',
  critico: 'Crítico',
  sem_dados: 'Sem dados',
}

// As 4 camadas medidas. Os ids são os mesmos do campo "tipo" do chamado na API.
// - min/max: faixa que o sensor consegue medir (simulada). Fora dela, a leitura é inválida.
// - atencao/critico: onde começa cada estado.
export const CAMADAS = {
  calor: {
    nome: 'Calor',
    unidade: '°C',
    min: -10,
    max: 60,
    atencao: 30, // a partir de 30 °C
    critico: 35, // acima de 35 °C
  },
  luz: {
    nome: 'Luz à noite',
    unidade: 'lux',
    min: 0,
    max: 1000,
    atencao: 20, // abaixo de 20 lux
    critico: 5, // abaixo de 5 lux
  },
  pavimento: {
    nome: 'Pavimento',
    unidade: 'g',
    min: 0,
    max: 16,
    atencao: 1.5, // a partir de 1,5 g
    critico: 2.0, // acima de 2,0 g
  },
  ar: {
    nome: 'Ar (PM2.5)',
    unidade: 'µg/m³',
    min: 0,
    max: 1000,
    atencao: 25, // acima de 25 µg/m³
    critico: 50, // acima de 50 µg/m³
  },
}

// Diz se a leitura pode ser usada: precisa ser número de verdade e estar dentro da faixa do sensor.
export function leituraValida(camada, valor) {
  const regra = CAMADAS[camada]
  if (!regra) return false
  // Vazio (null, undefined ou texto vazio) não conta como leitura.
  if (valor === null || valor === undefined || valor === '') return false
  const numero = Number(valor)
  // Number.isFinite descarta NaN e Infinity.
  if (!Number.isFinite(numero)) return false
  return numero >= regra.min && numero <= regra.max
}

// Recebe a camada ('calor', 'luz', 'pavimento' ou 'ar') e o valor lido.
// Devolve 'normal', 'atencao', 'critico' ou 'sem_dados'.
export function classificar(camada, valor) {
  if (!leituraValida(camada, valor)) return ESTADOS.SEM_DADOS

  const v = Number(valor)
  const regra = CAMADAS[camada]

  // Cada camada tem sua tabela, por isso um caso para cada uma.
  switch (camada) {
    case 'calor':
      // normal: abaixo de 30 | atenção: 30 a 35 | crítico: acima de 35
      if (v > regra.critico) return ESTADOS.CRITICO
      if (v >= regra.atencao) return ESTADOS.ATENCAO
      return ESTADOS.NORMAL

    case 'luz':
      // Aqui é ao contrário: quanto MENOS luz, pior.
      // normal: 20 ou mais | atenção: 5 a 20 | crítico: abaixo de 5
      if (v < regra.critico) return ESTADOS.CRITICO
      if (v < regra.atencao) return ESTADOS.ATENCAO
      return ESTADOS.NORMAL

    case 'pavimento':
      // normal: abaixo de 1,5 | atenção: 1,5 a 2,0 | crítico: acima de 2,0
      if (v > regra.critico) return ESTADOS.CRITICO
      if (v >= regra.atencao) return ESTADOS.ATENCAO
      return ESTADOS.NORMAL

    case 'ar':
      // normal: até 25 | atenção: 25 a 50 | crítico: acima de 50
      if (v > regra.critico) return ESTADOS.CRITICO
      if (v > regra.atencao) return ESTADOS.ATENCAO
      return ESTADOS.NORMAL

    default:
      return ESTADOS.SEM_DADOS
  }
}

// Ordem de gravidade, do menos ao mais grave.
const GRAVIDADE = ['sem_dados', 'normal', 'atencao', 'critico']

// Recebe uma lista de estados e devolve o mais grave.
// Ex.: ['normal', 'critico', 'atencao'] -> 'critico'. Lista vazia -> 'sem_dados'.
export function estadoMaisGrave(estados) {
  let pior = ESTADOS.SEM_DADOS
  for (const estado of estados) {
    if (GRAVIDADE.indexOf(estado) > GRAVIDADE.indexOf(pior)) {
      pior = estado
    }
  }
  return pior
}

// Estado de um ponto olhando uma camada ('calor', 'luz'...) ou todas ('geral').
// O ponto precisa vir do hook useLeituras (com .estados e .estadoGeral).
export function estadoDoPonto(ponto, camada) {
  if (camada === 'geral') return ponto.estadoGeral
  return ponto.estados[camada]
}

// Resumo de uma rua: quantos pontos em cada estado e o pior deles.
// Ex.: { normal: 3, atencao: 1, critico: 1, sem_dados: 0, pior: 'critico', total: 5 }
// A rua NÃO fica toda crítica: o resumo só conta quantos pontos têm problema.
export function resumirRua(rua, camada) {
  const resumo = { normal: 0, atencao: 0, critico: 0, sem_dados: 0, total: rua.pontos.length }
  const estados = rua.pontos.map((ponto) => estadoDoPonto(ponto, camada))
  for (const estado of estados) resumo[estado] += 1
  resumo.pior = estadoMaisGrave(estados)
  return resumo
}

// Texto do resumo. Ex.: '5 pontos · 1 crítico · 1 atenção' ou '5 pontos · todos normais'
export function textoResumo(resumo) {
  const partes = [`${resumo.total} pontos`]
  if (resumo.critico) partes.push(`${resumo.critico} crítico${resumo.critico > 1 ? 's' : ''}`)
  if (resumo.atencao) partes.push(`${resumo.atencao} atenção`)
  if (resumo.sem_dados) partes.push(`${resumo.sem_dados} sem dados`)
  if (partes.length === 1) partes.push('todos normais')
  return partes.join(' · ')
}
