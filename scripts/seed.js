// Script de "seed": coloca chamados de exemplo na API para a demonstração.
// Todos os dados são SIMULADOS.
//
// Como usar (na raiz do projeto):
//   npm run seed              -> só adiciona os exemplos
//   npm run seed -- --limpar  -> APAGA todos os chamados da API e depois adiciona os exemplos
//
// Atenção: a API do MockAPI é compartilhada. "--limpar" apaga os chamados de todo mundo.

import { readFileSync } from 'node:fs'

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

const EXEMPLOS = [
  {
    tipo: 'luz', trechoId: 5, trechoNome: 'R. Oscar Freire', status: 'aberto', prioridade: 'alta',
    origem: 'automatico', descricao: 'Leitura crítica em 6 passagens seguidas.', passagens: 6,
    criadoEm: horasAtras(1), resolvidoEm: '',
  },
  {
    tipo: 'ar', trechoId: 3, trechoNome: 'R. da Consolação', status: 'em_atendimento', prioridade: 'alta',
    origem: 'automatico', descricao: 'Leitura crítica em 6 passagens seguidas.', passagens: 6,
    criadoEm: horasAtras(5), resolvidoEm: '',
  },
  {
    tipo: 'pavimento', trechoId: 4, trechoNome: 'Av. Rebouças', status: 'aberto', prioridade: 'media',
    origem: 'cidadao', descricao: 'Buraco perto do ponto de ônibus.', passagens: 0,
    criadoEm: horasAtras(3), resolvidoEm: '',
  },
  {
    tipo: 'calor', trechoId: 1, trechoNome: 'Av. Paulista', status: 'resolvido', prioridade: 'media',
    origem: 'cidadao', descricao: 'Ponto sem sombra no meio da tarde.', passagens: 0,
    criadoEm: horasAtras(30), resolvidoEm: horasAtras(26),
  },
  {
    tipo: 'luz', trechoId: 2, trechoNome: 'R. Augusta', status: 'resolvido', prioridade: 'alta',
    origem: 'automatico', descricao: 'Leitura crítica em 6 passagens seguidas.', passagens: 6,
    criadoEm: horasAtras(48), resolvidoEm: horasAtras(40),
  },
  {
    tipo: 'pavimento', trechoId: 6, trechoNome: 'Av. Brig. Luís Antônio', status: 'aberto', prioridade: 'baixa',
    origem: 'cidadao', descricao: 'Calçada com piso solto.', passagens: 0,
    criadoEm: horasAtras(8), resolvidoEm: '',
  },
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
