// Camada do mapa com as ocorrências e os pontos de medição.
// Nada de pintar a rua inteira: só o lugar do problema muda de cor.
// - Luz e pavimento (um poste, um buraco): só o lugar exato, uns 20 m (20 números).
// - Calor e ar (se espalham): o trecho de 100 m do ponto de medição.
// Cores e padrões: atenção = fita listrada amarela e preta | crítico = fita vermelha |
// sem dados = tracejado cinza. Em cima vai o pictograma do estado (losango, octógono...).
//
// Props: ruas, camada, pontoSelecionadoId, pontosLendo (ids que o sensor está lendo agora),
// mostrarNormais (desenha também o visto dos pontos normais), aoSelecionarPonto(ponto).
import { Fragment } from 'react'
import { Marker, Polyline } from 'react-leaflet'
import { CAMADAS, ROTULOS_ESTADO, estadoDoPonto } from '../utils/classificar.js'
import { iconeEstado } from '../utils/icones.js'

// Linhas desenhadas por cima do lugar do problema, conforme o estado.
// Cada item vira uma <Polyline>; a segunda linha da atenção faz as listras.
const FITAS = {
  normal: [],
  atencao: [
    { color: '#FFC400', weight: 12 },
    { color: '#1B1C1E', weight: 12, dashArray: '4 8' },
  ],
  critico: [{ color: '#D7261E', weight: 13 }],
  sem_dados: [{ color: '#A9A59C', weight: 7, dashArray: '2 8' }],
}

// Em que camada está o problema que vamos mostrar.
// Na camada "Geral", é a camada com o pior estado do ponto.
function camadaDoProblema(ponto, camada) {
  if (camada !== 'geral') return camada
  return Object.keys(CAMADAS).find((c) => ponto.estados[c] === ponto.estadoGeral) || 'calor'
}

function CamadaPontos({ ruas, camada, pontoSelecionadoId, pontosLendo = [], mostrarNormais, aoSelecionarPonto }) {
  const pontos = ruas.flatMap((rua) => rua.pontos)
  const grande = ruas.length === 1 // uma rua só na tela: tudo um pouco maior

  return (
    <>
      {pontos.map((ponto) => {
        const estado = estadoDoPonto(ponto, camada)
        const selecionado = ponto.id === pontoSelecionadoId
        const lendo = pontosLendo.includes(ponto.id)
        const temProblema = estado === 'atencao' || estado === 'critico'
        if (!temProblema && estado !== 'sem_dados' && !mostrarNormais && !selecionado) return null

        // Lugar a destacar: o local exato da ocorrência, ou o trecho inteiro do ponto.
        const local = temProblema ? ponto.locais[camadaDoProblema(ponto, camada)] : null
        const trecho = local ? local.trecho : ponto.trecho
        const posicao = local ? local.centro : [ponto.lat, ponto.lng]
        const nome = local ? local.nome : ponto.nome

        return (
          <Fragment key={ponto.id}>
            {FITAS[estado].map((opcoes, i) => (
              <Polyline key={i} positions={trecho} pathOptions={{ ...opcoes, opacity: 1, lineCap: 'butt', interactive: false }} />
            ))}
            <Marker
              // A key muda junto com o estado: o React recria o marcador e o "title" fica certo
              // (o react-leaflet não atualiza o title de um marcador que já existe).
              key={`${estado}-${selecionado}-${lendo}-${nome}`}
              position={posicao}
              icon={iconeEstado(estado, { selecionado, lendo, grande })}
              // title vira o nome acessível do marcador (teclado e leitor de tela)
              title={`${ponto.ruaNome}, ${nome}: ${ROTULOS_ESTADO[estado]}`}
              keyboard
              zIndexOffset={selecionado ? 1000 : temProblema ? 500 : 0}
              eventHandlers={{ click: () => aoSelecionarPonto(ponto) }}
            />
          </Fragment>
        )
      })}
    </>
  )
}

export default CamadaPontos
