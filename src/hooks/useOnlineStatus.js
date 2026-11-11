// Custom hook que diz se o aparelho está com internet (true) ou sem (false).
// O navegador avisa pelos eventos "online" e "offline" da janela.
import { useState, useEffect } from 'react'

export function useOnlineStatus() {
  // navigator.onLine é o valor inicial que o navegador informa.
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    function ficouOnline() {
      setOnline(true)
    }
    function ficouOffline() {
      setOnline(false)
    }

    window.addEventListener('online', ficouOnline)
    window.addEventListener('offline', ficouOffline)

    // Limpeza: tira os "ouvintes" quando o componente sai da tela.
    return () => {
      window.removeEventListener('online', ficouOnline)
      window.removeEventListener('offline', ficouOffline)
    }
  }, [])

  return online
}
