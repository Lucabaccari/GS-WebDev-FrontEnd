// Custom hook que guarda a lista de chamados e conversa com a API pelo service.
// Os componentes só usam o que este hook devolve, sem saber nada de fetch.
import { useState, useEffect } from 'react'
import {
  listarChamados,
  criarChamado,
  atualizarChamado,
  excluirChamado,
} from '../services/chamadosService.js'

export function useChamados() {
  const [chamados, setChamados] = useState([]) // a lista que aparece na tela
  const [carregando, setCarregando] = useState(true) // true enquanto espera a API
  const [erro, setErro] = useState(null) // mensagem de erro, ou null se deu tudo certo

  // Busca a lista de novo (ex.: botão "Atualizar").
  async function carregar() {
    setCarregando(true)
    setErro(null)
    try {
      const dados = await listarChamados()
      setChamados(dados)
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }

  // useEffect com [] roda uma vez, quando o componente aparece na tela.
  // "carregando" já começa como true, então aqui só esperamos a resposta da API.
  useEffect(() => {
    listarChamados()
      .then((dados) => setChamados(dados))
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false))
  }, [])

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
