// Componente raiz. Por enquanto só confirma que React + Tailwind funcionam.
// Nos próximos commits ele vai trocar entre as telas Cidadão e Agente.
function App() {
  return (
    <main className="mx-auto max-w-xl p-4">
      <h1 className="text-4xl font-black uppercase [font-stretch:75%]">Pulso Web</h1>

      {/* Letreiro de teste: confirma a fonte Doto e as cores âmbar/painel */}
      <p className="mt-4 rounded-sm border-2 border-asfalto bg-painel px-4 py-3 font-letreiro text-2xl text-ambar">
        EM CONSTRUÇÃO
      </p>

      <p className="mt-4 inline-block border-2 border-asfalto bg-white px-2 py-1 text-sm font-bold uppercase shadow-dura">
        Dados simulados
      </p>
    </main>
  )
}

export default App
