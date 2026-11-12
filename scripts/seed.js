// Script de "seed": coloca chamados de exemplo na API para a demonstração.
// Todos os dados são SIMULADOS.
//
// Como usar (na raiz do projeto):
//   npm run seed              -> só adiciona os exemplos
//   npm run seed -- --limpar  -> APAGA todos os chamados da API e depois adiciona os exemplos
//
// Atenção: a API do MockAPI é compartilhada. "--limpar" apaga os chamados de todo mundo.

import { readFileSync } from 'node:fs'
import { buscarRua, pontoNoMetro, nomeDoTrecho } from '../src/data/ruas.js'
import { localDaOcorrencia } from '../src/utils/simulacao.js'
import { posicaoNoCaminho } from '../src/utils/geo.js'

// Lê a VITE_API_URL do arquivo .env (o Node não lê o .env sozinho).
function lerUrlDaApi() {
  if (process.env.VITE_API_URL) return process.env.VITE_API_URL
  try {
    const texto = readFileSync(new URL('../.env', import.meta.url), 'utf8')
    const linha = texto.split('\n').find((l) => l.startsWith('VITE_API_URL='))
    return linha ? linha.replace('VITE_API_URL=', '').trim() : null
  } catch {
    return null
  }
}

// Data ISO de "X horas atrás", para os exemplos parecerem ter acontecido antes.
function horasAtras(horas) {
  return new Date(Date.now() - horas * 60 * 60 * 1000).toISOString()
}

// Monta um chamado de exemplo num lugar da rua: ruaId + metro (= numeração simulada) + tipo.
// O ponto, o nome do local ("nº 1036 a 1056") e as coordenadas saem dos mesmos arquivos do app.
function exemplo(ruaId, metro, campos) {
  const ponto = pontoNoMetro(ruaId, metro)
  const rua = buscarRua(ruaId)
  const local = localDaOcorrencia(ponto, campos.tipo)
  const centro = posicaoNoCaminho(rua.caminho, (local.inicioM + local.fimM) / 2 / rua.comprimentoM)
  return {
    trechoId: ruaId,
    trechoNome: rua.nome,
    pontoId: ponto.id,
    pontoNome: nomeDoTrecho(local.numeroDe, local.numeroAte),
    lat: centro[0],
    lng: centro[1],
    resolvidoEm: '',
    ...campos,
  }
}

const AUTOMATICO = { origem: 'automatico', descricao: 'Leitura crítica em 6 passagens seguidas.', passagens: 6, prioridade: 'alta' }

// Os exemplos ficam nos mesmos lugares dos problemas simulados (utils/simulacao.js).
const EXEMPLOS = [
  exemplo(5, 1046, { ...AUTOMATICO, tipo: 'luz', status: 'aberto', criadoEm: horasAtras(1) }),
  exemplo(3, 640, { ...AUTOMATICO, tipo: 'ar', status: 'em_atendimento', criadoEm: horasAtras(5) }),
  exemplo(4, 764, {
    tipo: 'pavimento', status: 'aberto', prioridade: 'media', origem: 'cidadao',
    descricao: 'Buraco perto do ponto de ônibus.', passagens: 0, criadoEm: horasAtras(3),
  }),
  exemplo(1, 1240, {
    tipo: 'calor', status: 'resolvido', prioridade: 'media', origem: 'cidadao',
    descricao: 'Trecho sem sombra no meio da tarde.', passagens: 0, criadoEm: horasAtras(30), resolvidoEm: horasAtras(26),
  }),
  exemplo(2, 1862, { ...AUTOMATICO, tipo: 'luz', status: 'resolvido', criadoEm: horasAtras(48), resolvidoEm: horasAtras(40) }),
  exemplo(6, 522, {
    tipo: 'pavimento', status: 'aberto', prioridade: 'baixa', origem: 'cidadao',
    descricao: 'Calçada com piso solto.', passagens: 0, criadoEm: horasAtras(8),
  }),
]

async function main() {
  const url = lerUrlDaApi()
  if (!url) {
    console.error('VITE_API_URL não encontrada. Crie o .env a partir do .env.example.')
    process.exit(1)
  }
  const recurso = `${url}/chamados`

  if (process.argv.includes('--limpar')) {
    const atuais = await (await fetch(recurso)).json()
    for (const chamado of atuais) {
      await fetch(`${recurso}/${chamado.id}`, { method: 'DELETE' })
    }
    console.log(`Apagados: ${atuais.length} chamado(s).`)
  }

  for (const exemplo of EXEMPLOS) {
    const resposta = await fetch(recurso, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(exemplo),
    })
    if (!resposta.ok) throw new Error(`Erro ${resposta.status} ao criar chamado.`)
  }
  console.log(`Criados: ${EXEMPLOS.length} chamado(s) de exemplo (dados simulados).`)
}

main().catch((erro) => {
  console.error(erro.message)
  process.exit(1)
})
