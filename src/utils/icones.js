// Ícones para o mapa do Leaflet.
// O Leaflet não entende componentes React: ele recebe o ícone como texto HTML.
// Por isso os desenhos abaixo são o mesmo SVG do componente StatusPicto, escrito como texto.
import L from 'leaflet'

// Desenho de cada estado (mesmo viewBox 0 0 24 24 do StatusPicto).
const DESENHOS = {
  normal: '<polyline points="4,12.5 9.5,18 20,6" fill="none" stroke="#17753F" stroke-width="3.5" stroke-linecap="square"/>',
  atencao:
    '<polygon points="12,1.5 22.5,12 12,22.5 1.5,12" fill="#FFC400" stroke="#1B1C1E" stroke-width="2"/>' +
    '<rect x="11" y="6.5" width="2" height="7" fill="#1B1C1E"/><rect x="11" y="15.5" width="2" height="2" fill="#1B1C1E"/>',
  critico:
    '<polygon points="7.5,1.5 16.5,1.5 22.5,7.5 22.5,16.5 16.5,22.5 7.5,22.5 1.5,16.5 1.5,7.5" fill="#D7261E" stroke="#1B1C1E" stroke-width="2"/>' +
    '<rect x="6" y="10.5" width="12" height="3" fill="#FFFFFF"/>',
  sem_dados:
    '<rect x="3" y="3" width="18" height="18" fill="#FFFFFF" stroke="#1B1C1E" stroke-width="2" stroke-dasharray="3 2"/>' +
    '<rect x="8" y="11" width="8" height="2" fill="#1B1C1E"/>',
}

// Ícone de um estado (visto, losango, octógono, tracejado).
// O visto ganha um quadrado branco atrás para aparecer bem em cima da rua escura.
// selecionado = true desenha uma moldura quadrada escura em volta (sem círculo, como pede o guia).
// lendo = true desenha a moldura em âmbar: é o ponto que o sensor está lendo agora.
// grande = true deixa os pontos normais maiores (quando o mapa mostra uma rua só).
const cacheEstado = new Map() // guarda ícones já criados: a tela redesenha 5 vezes por segundo

export function iconeEstado(estado, { selecionado = false, lendo = false, grande = false } = {}) {
  const chave = `${estado}-${selecionado}-${lendo}-${grande}`
  if (cacheEstado.has(chave)) return cacheEstado.get(chave)

  // Pontos normais ficam menores, para o mapa não ficar poluído; os problemas chamam atenção.
  const tamanho = selecionado || lendo ? 34 : estado === 'normal' ? (grande ? 24 : 18) : 28
  const fundo = estado === 'normal' ? '<rect x="1" y="1" width="22" height="22" fill="#FFFFFF" stroke="#1B1C1E" stroke-width="1.5"/>' : ''
  const svg = `<svg width="${tamanho}" height="${tamanho}" viewBox="0 0 24 24" aria-hidden="true">${fundo}${DESENHOS[estado]}</svg>`
  const corMoldura = lendo ? '#FFB000' : '#1B1C1E'
  const moldura = selecionado || lendo ? `outline:3px solid ${corMoldura};outline-offset:3px;background:#FFFFFF;` : ''
  const icone = L.divIcon({
    html: `<div style="display:flex;${moldura}">${svg}</div>`,
    className: 'pulso-icone', // sem a caixa branca padrão do Leaflet
    iconSize: [tamanho, tamanho],
    iconAnchor: [tamanho / 2, tamanho / 2],
  })
  cacheEstado.set(chave, icone)
  return icone
}

// Placa de parada de ônibus: um poste com uma plaquinha azul-asfalto e um ônibus branco.
// Fica de lado da rua (âncora embaixo, à esquerda), para não cobrir os pontos.
export const ICONE_PARADA = L.divIcon({
  html: `<svg width="22" height="30" viewBox="0 0 22 30" aria-hidden="true">
    <rect x="2" y="12" width="2.5" height="18" fill="#1B1C1E"/>
    <rect x="1" y="1" width="20" height="13" fill="#1B1C1E" stroke="#FFFFFF" stroke-width="1.5"/>
    <rect x="5" y="4" width="12" height="6" rx="1.5" fill="#FFFFFF"/>
    <rect x="6.5" y="5" width="9" height="2" fill="#1B1C1E"/>
  </svg>`,
  className: 'pulso-icone',
  iconSize: [22, 30],
  iconAnchor: [3, 30],
})

// Ícone do ônibus visto de cima, com a caixa de sensores âmbar no teto.
// O desenho aponta para o norte e é girado (rumo, em graus) para o lado em que o ônibus anda.
// Quando o sensor está medindo (ônibus andando), a caixa ganha a classe "sensor-lendo" (pisca no CSS).
const cacheOnibus = new Map() // guarda ícones já criados, para não criar um novo a cada quadro

// pequeno = true: versão menor, para o mapa amplo com as 6 ruas.
export function iconeOnibus(rumo, lendo, pequeno = false) {
  const angulo = Math.round(rumo / 5) * 5 // arredonda de 5 em 5 graus
  const chave = `${angulo}-${lendo}-${pequeno}`
  if (cacheOnibus.has(chave)) return cacheOnibus.get(chave)

  const escala = pequeno ? 0.65 : 1
  const icone = L.divIcon({
    html: `<div style="transform:rotate(${angulo}deg) scale(${escala});width:44px;height:64px;display:flex;align-items:center;justify-content:center">
      <svg width="30" height="64" viewBox="-15 -32 30 64" aria-hidden="true">
        <rect x="-13" y="-30" width="26" height="60" rx="7" fill="#1B1C1E" stroke="#FFFFFF" stroke-width="2.5"/>
        <rect x="-9" y="-26" width="18" height="7" rx="2" fill="#BFD3E0"/>
        <rect x="-9" y="22" width="18" height="3" rx="1" fill="#5A5C60"/>
        <rect x="-15" y="-21" width="3" height="5" fill="#1B1C1E"/><rect x="12" y="-21" width="3" height="5" fill="#1B1C1E"/>
        <g class="${lendo ? 'sensor-lendo' : ''}">
          <rect x="-7" y="-10" width="14" height="16" fill="#FFB000" stroke="#1B1C1E" stroke-width="1.5"/>
          <polyline points="-5,-2 -2,-2 0,-7 2,3 4,-2 5,-2" fill="none" stroke="#1B1C1E" stroke-width="1.6"/>
        </g>
      </svg>
    </div>`,
    className: 'pulso-icone onibus-icone',
    iconSize: [44, 64],
    iconAnchor: [22, 32], // o centro do ônibus fica em cima da posição
  })
  cacheOnibus.set(chave, icone)
  return icone
}
