// Regras e textos dos chamados. Funções puras: não chamam a API nem mexem na tela.
import { CAMADAS } from './classificar.js'

export const ROTULOS_STATUS = {
  aberto: 'Aberto',
  em_atendimento: 'Em atendimento',
  resolvido: 'Resolvido',
}

export const ROTULOS_PRIORIDADE = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
}

export const ROTULOS_ORIGEM = {
  automatico: 'Automático',
  cidadao: 'Cidadão',
}

// O "tipo" do chamado usa os mesmos ids das camadas (calor, luz, pavimento, ar).
export function rotuloTipo(tipo) {
  return CAMADAS[tipo] ? CAMADAS[tipo].nome : tipo
}

// A prioridade segue o estado atual do trecho naquela camada.
// Crítico -> alta | atenção -> média | normal ou sem dados -> baixa.
export function prioridadePorEstado(estado) {
  if (estado === 'critico') return 'alta'
  if (estado === 'atencao') return 'media'
  return 'baixa'
}

// Monta os dados de um chamado aberto pelo cidadão (sem id, status e datas:
// isso o hook useChamados completa na hora de criar).
export function montarChamadoCidadao({ trecho, tipo, descricao }) {
  return {
    tipo,
    trechoId: trecho.id,
    trechoNome: trecho.nome,
    prioridade: prioridadePorEstado(trecho.estados[tipo]),
    origem: 'cidadao',
    descricao: descricao.trim(),
    passagens: 0,
  }
}

// Confere o formulário. Devolve a mensagem de erro, ou null se está tudo certo.
export function validarFormulario({ trechoId, tipo, descricao }) {
  if (!trechoId) return 'Escolha o trecho.'
  if (!tipo) return 'Escolha o tipo do problema.'
  if (descricao.trim().length < 5) return 'Descreva o problema com pelo menos 5 letras.'
  return null
}

// Filtros sem nada escolhido: mostra todos os chamados.
export const FILTROS_VAZIOS = { status: '', tipo: '', trechoId: '' }

// Aplica os filtros escolhidos. Filtro vazio ('') significa "todos".
// Devolve a lista filtrada, do chamado mais novo para o mais antigo.
export function filtrarChamados(chamados, filtros) {
  return chamados
    .filter((c) => !filtros.status || c.status === filtros.status)
    .filter((c) => !filtros.tipo || c.tipo === filtros.tipo)
    .filter((c) => !filtros.trechoId || Number(c.trechoId) === Number(filtros.trechoId))
    .sort((a, b) => (a.criadoEm < b.criadoEm ? 1 : -1))
}
