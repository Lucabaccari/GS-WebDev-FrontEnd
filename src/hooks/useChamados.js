// Custom hook que guarda a lista de chamados e conversa com a API pelo service.
// Os componentes só usam o que este hook devolve, sem saber nada de fetch.
import { useState, useEffect } from 'react'
import {
  listarChamados,
  criarChamado,
  atualizarChamado,
  excluirChamado,
} from '../services/chamadosService.js'
import { salvarCache, lerCache } from '../services/cache.js'

const CHAVE_CACHE = 'pulso:chamados' // nome da cópia salva no navegador

export function useChamados() {
  const [chamados, setChamados] = useState([]) // a lista que aparece na tela
  const [carregando, setCarregando] = useState(true) // true enquanto espera a API
  const [erro, setErro] = useState(null) // mensagem de erro, ou null se deu tudo certo

  // Quando a API falha (ex.: sem internet), mostra a última cópia salva, se houver.
  function usarCache(e) {
    const salvos = lerCache(CHAVE_CACHE)
    if (salvos) {
      setChamados(salvos)
      setErro('Sem conexão com a API. Mostrando os últimos chamados salvos.')
    } else {
      setErro(e.message)
    }
  }

  // Busca a lista de novo (ex.: botão "Tentar de novo" ou quando a internet volta).
  async function carregar() {
    setCarregando(true)
    setErro(null)
    try {
      const dados = await listarChamados()
      setChamados(dados)
    } catch (e) {
      usarCache(e)
    } finally {
      setCarregando(false)
    }
  }

  // useEffect com [] roda uma vez, quando o componente aparece na tela.
  // "carregando" já começa como true, então aqui só esperamos a resposta da API.
  useEffect(() => {
    listarChamados()
      .then((dados) => setChamados(dados))
      .catch(usarCache)
      .finally(() => setCarregando(false))
  }, [])

  // Toda vez que a lista muda (e já terminou de carregar), salva uma cópia no navegador.
  // Esperar o carregamento evita apagar a cópia antiga com a lista vazia do começo.
  useEffect(() => {
    if (!carregando) salvarCache(CHAVE_CACHE, chamados)
  }, [chamados, carregando])

  // Cria na API e coloca o chamado novo no começo da lista.
  async function criar(dados) {
    setErro(null)
    try {
      const novo = await criarChamado({
        ...dados,
        status: 'aberto',
        criadoEm: new Date().toISOString(),
        resolvidoEm: '',
      })
      setChamados((lista) => [novo, ...lista])
      return novo
    } catch (e) {
      setErro(e.message)
      return null
    }
  }

  // Atualiza na API e troca o chamado antigo pelo novo na lista.
  async function atualizar(chamado) {
    setErro(null)
    try {
      const atualizado = await atualizarChamado(chamado)
      setChamados((lista) => lista.map((c) => (c.id === atualizado.id ? atualizado : c)))
      return atualizado
    } catch (e) {
      setErro(e.message)
      return null
    }
  }

  // Atalho para mudar só o status. Ao resolver, grava a data em resolvidoEm.
  function mudarStatus(chamado, status) {
    const resolvidoEm = status === 'resolvido' ? new Date().toISOString() : ''
    return atualizar({ ...chamado, status, resolvidoEm })
  }

  // Exclui na API e tira o chamado da lista.
  async function excluir(id) {
    setErro(null)
    try {
      await excluirChamado(id)
      setChamados((lista) => lista.filter((c) => c.id !== id))
      return true
    } catch (e) {
      setErro(e.message)
      return false
    }
  }

  return { chamados, carregando, erro, carregar, criar, atualizar, mudarStatus, excluir }
}
