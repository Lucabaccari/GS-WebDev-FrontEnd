// Contas simples de mapa. Funções puras.
// As posições são sempre [latitude, longitude].

// Distância aproximada em metros entre dois pontos.
// Em distâncias curtas (uma rua), dá para tratar a Terra como plana.
export function distanciaM(a, b) {
  const metrosPorGrauLat = 110540
  const metrosPorGrauLng = 111320 * Math.cos((a[0] * Math.PI) / 180)
  return Math.hypot((a[0] - b[0]) * metrosPorGrauLat, (a[1] - b[1]) * metrosPorGrauLng)
}

// Comprimento de cada pedaço do caminho e o total, em metros.
function medirCaminho(caminho) {
  const pedacos = []
  let total = 0
  for (let i = 0; i < caminho.length - 1; i++) {
    const d = distanciaM(caminho[i], caminho[i + 1])
    pedacos.push(d)
    total += d
  }
  return { pedacos, total }
}

// Posição ao longo de um caminho. fracao = 0 é o começo, 1 é o fim, 0.5 é o meio.
// Usado para o ônibus "andar" pela rua.
export function posicaoNoCaminho(caminho, fracao) {
  const { pedacos, total } = medirCaminho(caminho)
  let alvo = Math.min(Math.max(fracao, 0), 1) * total

  // Anda pelos pedaços até chegar na distância pedida.
  for (let i = 0; i < pedacos.length; i++) {
    if (alvo <= pedacos[i]) {
      const t = pedacos[i] === 0 ? 0 : alvo / pedacos[i]
      return [
        caminho[i][0] + (caminho[i + 1][0] - caminho[i][0]) * t,
        caminho[i][1] + (caminho[i + 1][1] - caminho[i][1]) * t,
      ]
    }
    alvo -= pedacos[i]
  }
  return caminho[caminho.length - 1]
}

// O contrário da função acima: em que fração do caminho fica um ponto?
// Procura o lugar do caminho mais perto do ponto. Usado para saber onde ficam as paradas.
export function fracaoNoCaminho(caminho, ponto) {
  const { pedacos, total } = medirCaminho(caminho)
  let melhor = { distancia: Infinity, fracao: 0 }
  let percorrido = 0

  for (let i = 0; i < pedacos.length; i++) {
    // Testa 20 posições dentro de cada pedaço (simples e preciso o bastante para uma rua).
    for (let k = 0; k <= 20; k++) {
      const t = k / 20
      const p = [
        caminho[i][0] + (caminho[i + 1][0] - caminho[i][0]) * t,
        caminho[i][1] + (caminho[i + 1][1] - caminho[i][1]) * t,
      ]
      const d = distanciaM(p, ponto)
      if (d < melhor.distancia) melhor = { distancia: d, fracao: (percorrido + pedacos[i] * t) / total }
    }
    percorrido += pedacos[i]
  }
  return melhor.fracao
}

// Pedaço do caminho entre duas frações (ex.: do começo até onde o ônibus está).
export function trechoDoCaminho(caminho, de, ate) {
  const { pedacos, total } = medirCaminho(caminho)
  const resultado = [posicaoNoCaminho(caminho, de)]
  let percorrido = 0
  // Inclui os pontos do meio do caminho que ficam entre "de" e "ate".
  for (let i = 0; i < pedacos.length; i++) {
    percorrido += pedacos[i]
    const f = percorrido / total
    if (f > de && f < ate) resultado.push(caminho[i + 1])
  }
  resultado.push(posicaoNoCaminho(caminho, ate))
  return resultado
}

// Direção (rumo) do caminho numa fração, em graus: 0 = norte, 90 = leste.
// Usado para girar o ícone do ônibus para o lado que ele está indo.
export function rumoNoCaminho(caminho, fracao) {
  const passo = 0.01
  const a = posicaoNoCaminho(caminho, Math.min(fracao, 1 - passo))
  const b = posicaoNoCaminho(caminho, Math.min(fracao, 1 - passo) + passo)
  const dLeste = (b[1] - a[1]) * Math.cos((a[0] * Math.PI) / 180)
  const dNorte = b[0] - a[0]
  return (Math.atan2(dLeste, dNorte) * 180) / Math.PI
}

// Retângulo que contém todos os pontos: [[lat mín, lng mín], [lat máx, lng máx]].
export function limitesDe(posicoes) {
  const lats = posicoes.map((p) => p[0])
  const lngs = posicoes.map((p) => p[1])
  return [
    [Math.min(...lats), Math.min(...lngs)],
    [Math.max(...lats), Math.max(...lngs)],
  ]
}
