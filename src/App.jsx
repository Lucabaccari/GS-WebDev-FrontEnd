// Componente raiz. Por enquanto mostra os 6 trechos mudando de estado.
// No commit 6 ele vai trocar entre as telas Cidadão e Agente.
import { useLeituras } from './hooks/useLeituras.js'
import CartaoTrecho from './components/CartaoTrecho.jsx'

function App() {
  const { trechos, passagem } = useLeituras()

  return (
    <main className="mx-auto max-w-6xl p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-4xl font-black uppercase [font-stretch:75%]">Pulso Web</h1>
        <p className="border-2 border-asfalto bg-white px-2 py-1 text-sm font-bold uppercase shadow-dura">
          Dados simulados
        </p>
      </div>

      {/* aria-live: o leitor de tela avisa quando o número da passagem muda */}
      <p className="mt-4 inline-block border-2 border-asfalto bg-painel px-3 py-2 font-letreiro text-xl text-ambar" aria-live="polite">
        PASSAGEM {passagem}
      </p>

      <section className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Trechos da linha">
        {trechos.map((trecho) => (
          <CartaoTrecho key={trecho.id} trecho={trecho} />
        ))}
      </section>
    </main>
  )
}

export default App
