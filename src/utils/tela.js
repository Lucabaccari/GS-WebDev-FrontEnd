// Tamanho da tela. Usado pelo mapa (Leaflet), que não entende as classes do Tailwind:
// no celular, os ícones do mapa ficam menores e o enquadramento, mais justo.

// true quando a tela tem menos de 640 px de largura (o "sm" do Tailwind).
export function ehCelular() {
  return window.matchMedia('(max-width: 639px)').matches
}
