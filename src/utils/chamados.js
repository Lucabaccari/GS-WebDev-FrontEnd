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

// Tipos de problema que um chamado pode ter: as 4 camadas do sensor + "Outros"
// (algo que o sensor não mede, como lixo, calçada ocupada, semáforo quebrado...).
export const TIPOS_DE_PROBLEMA = [
  ...Object.entries(CAMADAS).map(([id, regra]) => ({ id, nome: regra.nome })),
  { id: 'outros', nome: 'Outros' },
]

// O "tipo" do chamado usa os mesmos ids das camadas (calor, luz, pavimento, ar) ou 'outros'.
export function rotuloTipo(tipo) {
  return TIPOS_DE_PROBLEMA.find((t) => t.id === tipo)?.nome || tipo
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
// O ponto vem do useLeituras (com .estados), por isso a prioridade usa o estado atual dele.
// Em "Outros" o sensor não mede nada, então a prioridade começa baixa (o agente decide).
export function montarChamadoCidadao({ ponto, tipo, descricao }) {
  // Se o sensor já achou um problema desse tipo aqui, usa o local exato dele; senão, o trecho do ponto.
  const local = ponto.locais[tipo] || { nome: ponto.nome, centro: [ponto.lat, ponto.lng] }
  return {
    tipo,
    trechoId: ponto.ruaId, // na API o campo continua "trecho"; aqui ele guarda a rua
    trechoNome: ponto.ruaNome,
    pontoId: ponto.id,
    pontoNome: local.nome,
    lat: local.centro[0],
    lng: local.centro[1],
    prioridade: prioridadePorEstado(ponto.estados[tipo]), // tipo "outros" não tem estado: baixa
    origem: 'cidadao',
    descricao: descricao.trim(),
    passagens: 0,
  }
}

// Confere o formulário. Devolve a mensagem de erro, ou null se está tudo certo.
export function validarFormulario({ ruaId, pontoId, tipo, descricao }) {
  if (!ruaId) return 'Escolha a rua.'
  if (!pontoId) return 'Escolha o trecho da rua.'
  if (!tipo) return 'Escolha o tipo do problema.'
  // Em "Outros" a descrição é o único jeito de saber o que é, então pede um pouco mais.
  const minimo = tipo === 'outros' ? 10 : 5
  if (descricao.trim().length < minimo) return `Descreva o problema com pelo menos ${minimo} letras.`
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

// Ordem da fila do agente: primeiro o que está sem resolver, depois a prioridade
// (alta, média, baixa) e, empatando, o chamado mais antigo primeiro (espera há mais tempo).
const ORDEM_STATUS = { aberto: 0, em_atendimento: 1, resolvido: 2 }
const ORDEM_PRIORIDADE = { alta: 0, media: 1, baixa: 2 }

export function ordenarFila(chamados) {
  return [...chamados].sort(
    (a, b) =>
      (ORDEM_STATUS[a.status] ?? 3) - (ORDEM_STATUS[b.status] ?? 3) ||
      (ORDEM_PRIORIDADE[a.prioridade] ?? 3) - (ORDEM_PRIORIDADE[b.prioridade] ?? 3) ||
      (a.criadoEm < b.criadoEm ? -1 : 1),
  )
}

// Texto do local do chamado. Chamados antigos podem não ter o ponto.
// Ex.: 'R. Oscar Freire, altura do nº 900'
export function localDoChamado(chamado) {
  return chamado.pontoNome ? `${chamado.trechoNome}, ${chamado.pontoNome}` : chamado.trechoNome
}
