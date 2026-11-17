// Cartão com um número real (usado no Início). A fonte de cada número fica no rodapé da página.
// Props: valor ('13.496'), rotulo e detalhe.

function CartaoDado({ valor, rotulo, detalhe }) {
  return (
    <article className="flex flex-col rounded-2xl border border-linha bg-white p-5">
      <p className="text-4xl font-medium tracking-tight tabular-nums">{valor}</p>
      <h3 className="mt-1 font-medium">{rotulo}</h3>
      <p className="mt-2 text-sm text-tinta-2">{detalhe}</p>
    </article>
  )
}

export default CartaoDado
