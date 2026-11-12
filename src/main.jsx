// Ponto de entrada: o React desenha o componente App dentro da <div id="root"> do index.html.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'leaflet/dist/leaflet.css' // estilos do mapa (precisa vir antes do nosso CSS)
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
