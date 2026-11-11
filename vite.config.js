import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Configuração do Vite: liga o React (JSX) e o Tailwind CSS.
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
