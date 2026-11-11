// Cliente HTTP básico: o único lugar do app que chama fetch.
// Os outros services usam a função requisicao() daqui.

// Endereço da API, lido do arquivo .env (variável VITE_API_URL).
const URL_BASE = import.meta.env.VITE_API_URL

// Faz uma requisição e devolve o JSON da resposta.
// caminho: ex. '/chamados' | opcoes: método e corpo, ex. { method: 'POST', body: {...} }
export async function requisicao(caminho, opcoes = {}) {
  if (!URL_BASE) {
    throw new Error('VITE_API_URL não definida. Crie o arquivo .env a partir do .env.example.')
  }

  const resposta = await fetch(URL_BASE + caminho, {
    method: opcoes.method || 'GET',
    headers: { 'Content-Type': 'application/json' },
    // O corpo só existe em POST e PUT. JSON.stringify transforma o objeto em texto.
    body: opcoes.body ? JSON.stringify(opcoes.body) : undefined,
  })

  // fetch não dá erro sozinho quando o servidor responde 404 ou 500, então conferimos aqui.
  if (!resposta.ok) {
    throw new Error(`Erro ${resposta.status} ao acessar a API.`)
  }

  return resposta.json()
}
