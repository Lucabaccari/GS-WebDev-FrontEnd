// CRUD do recurso /chamados no MockAPI.
// Só faz as chamadas HTTP. Quem decide QUANDO chamar é o hook useChamados.
import { requisicao } from './api.js'

const RECURSO = '/chamados'

// C (create): cria um chamado novo. O MockAPI gera o id e devolve o chamado criado.
export function criarChamado(chamado) {
  return requisicao(RECURSO, { method: 'POST', body: chamado })
}

// R (read): busca todos os chamados.
export function listarChamados() {
  return requisicao(RECURSO)
}

// R (read): busca um chamado pelo id.
export function buscarChamado(id) {
  return requisicao(`${RECURSO}/${id}`)
}

// U (update): PUT substitui o chamado inteiro, por isso enviamos o objeto completo.
export function atualizarChamado(chamado) {
  return requisicao(`${RECURSO}/${chamado.id}`, { method: 'PUT', body: chamado })
}

// D (delete): exclui um chamado pelo id.
export function excluirChamado(id) {
  return requisicao(`${RECURSO}/${id}`, { method: 'DELETE' })
}
