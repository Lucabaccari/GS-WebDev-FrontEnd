// Guarda uma cópia dos dados no navegador (localStorage) para usar sem internet.
// O try/catch evita que o app quebre se o navegador bloquear o armazenamento
// (por exemplo, em janela anônima).

export function salvarCache(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor))
  } catch {
    // Sem armazenamento disponível: segue sem cache.
  }
}

// Devolve o valor salvo, ou null se não houver nada.
export function lerCache(chave) {
  try {
    const texto = localStorage.getItem(chave)
    return texto ? JSON.parse(texto) : null
  } catch {
    return null
  }
}
