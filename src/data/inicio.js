// Textos e dados da página inicial (Início).
// O discurso segue o vídeo do grupo. Os números REAIS vêm de fontes públicas (lista FONTES, no fim).
// O que é do próprio Pulso (protótipo, regra, simulação) está marcado como tal.
import { PASSAGENS_PARA_CHAMADO } from '../utils/regras.js'

// Números reais sobre São Paulo. O "fonte" liga cada número à lista FONTES (mostrada no rodapé).
export const DADOS = [
  {
    valor: '13.496',
    rotulo: 'ônibus na frota municipal de São Paulo',
    detalhe: 'Frota contratada das empresas em dezembro de 2025, entre ônibus nas linhas e reservas. Cada um pode levar um sensor.',
    fonte: 'frota',
  },
  {
    valor: '7 mi',
    rotulo: 'passageiros por dia nos ônibus',
    detalhe: 'Média diária de 7,05 milhões de pessoas em 2025. Elas esperam e andam pelas ruas que o Pulso mede.',
    fonte: 'passageiros',
  },
  {
    valor: '600 mil',
    rotulo: 'pontos de iluminação pública',
    detalhe: 'Hoje, um poste apagado costuma ser consertado depois que alguém reclama.',
    fonte: 'iluminacao',
  },
  {
    valor: '120 mil',
    rotulo: 'mortes ligadas a ondas de calor no Brasil',
    detalhe: 'Estimativa para 2000 a 2019. Idosos e pessoas com doenças respiratórias são os mais afetados.',
    fonte: 'calor_mortes',
  },
]

// A comparação do vídeo: dois bairros vizinhos, temperaturas de superfície muito diferentes.
export const COMPARACAO_CALOR = {
  // \u00a0 é um espaço que não quebra: o "°C" nunca fica sozinho na linha de baixo.
  titulo: 'Vizinhos, mas com 15\u00a0°C de diferença',
  texto:
    'No verão de 2024/25, as ruas e os telhados de Paraisópolis chegaram a 45\u00a0°C. Os do Morumbi, a poucas ruas, ficaram perto de 30\u00a0°C.',
  bairros: [
    { nome: 'Paraisópolis', valor: 45, estado: 'critico' },
    { nome: 'Morumbi', valor: 30, estado: 'atencao' },
  ],
  nota: 'Temperatura de superfície medida por satélite (Landsat 8). É mais alta que a temperatura do ar.',
  fonte: 'paraisopolis',
}

// Como o Pulso funciona, em 4 passos (mesma ordem do vídeo).
export const PASSOS = [
  {
    numero: '01',
    titulo: 'Mede',
    texto: 'Uma caixinha de sensores no teto do ônibus mede calor, iluminação, buracos e poluição enquanto ele faz a rota normal.',
  },
  {
    numero: '02',
    titulo: 'Confirma',
    texto: 'Um alerta só pode ser engano. O problema se confirma de 2 jeitos: o ônibus passa de novo e repete o alerta, ou um cidadão avisa pelo app.',
  },
  {
    numero: '03',
    titulo: 'Abre o chamado',
    texto: `No ${PASSAGENS_PARA_CHAMADO}º alerta seguido, o chamado nasce sozinho, com o número exato da rua. Se um cidadão avisar antes, o chamado nasce na hora.`,
  },
  {
    numero: '04',
    titulo: 'Orienta',
    texto: 'No celular, o cidadão vê qual caminho está mais fresco e iluminado. A subprefeitura vê onde agir primeiro.',
  },
]

// Por dentro do Pulso (protótipo físico do grupo, mostrado no vídeo).
// "icone" escolhe o desenho no diagrama; "ligacao" é o rótulo da seta até o próximo bloco.
export const POR_DENTRO = [
  { icone: 'dispositivo', titulo: 'Dispositivo', texto: 'ESP32 com sensores no teto do ônibus. Mede o estado de cada trecho.', ligacao: 'MQTT' },
  { icone: 'servidor', titulo: 'Back-end', texto: 'As leituras viajam por MQTT até o servidor.', ligacao: 'estados e chamados' },
  { icone: 'aplicacoes', titulo: 'Aplicações', texto: 'O painel da subprefeitura e o app do cidadão transformam a leitura em ação e solução.' },
]

// O caminho de um problema, da leitura até a solução (a regra de negócio do Pulso).
export const FLUXO_DO_CHAMADO = [
  { id: 'leitura', titulo: 'Leitura', texto: 'O ônibus passa e o sensor lê o ponto: 1,8 lux.' },
  { id: 'estado', titulo: 'Estado', texto: 'O valor vira normal, atenção ou crítico.' },
  { id: 'alertas', titulo: `${PASSAGENS_PARA_CHAMADO} alertas seguidos`, texto: `O mesmo ponto dá crítico em ${PASSAGENS_PARA_CHAMADO} passagens. Ou um cidadão avisa antes.` },
  { id: 'chamado', titulo: 'Chamado', texto: 'Nasce com o local exato e prioridade.' },
  { id: 'agente', titulo: 'Agente resolve', texto: 'Aberto, em atendimento, resolvido.' },
]

// Fontes dos números reais. Tudo o que não está aqui é simulado ou é do próprio projeto.
export const FONTES = {
  frota: {
    texto: 'Diário do Transporte, a partir de dados da SPTrans e da SMT (frota contratada, dez. 2025)',
    url: 'https://diariodotransporte.com.br/2026/01/27/exclusivo-micrao-midi-ganha-mais-um-ano-de-tolerancia-com-2214-onibus-acima-de-11-anos-sistema-sptrans-da-capital-paulista-tem-164-de-toda-a-frota-envelhecida/',
  },
  passageiros: {
    texto: 'Diário do Transporte, a partir de dados da SPTrans (média diária de 2025)',
    url: 'https://diariodotransporte.com.br/2026/01/02/media-diaria-de-passageiros-transportados-nos-onibus-da-capital-paulista-cai-27-desde-2016-o-que-influencia-em-tarifas-e-subsidios-maiores-diz-sptrans/',
  },
  iluminacao: {
    texto: 'Prefeitura de São Paulo (mais de 600 mil pontos de iluminação pública, 2021)',
    url: 'https://prefeitura.sp.gov.br/web/licenciamento/w/noticias/315719',
  },
  calor_mortes: {
    texto: 'Band, sobre estudo da Fiocruz e da UFBA (ondas de calor, 2000 a 2019)',
    url: 'https://www.band.com.br/saude/brasil-teve-120-mil-mortes-associadas-a-ondas-de-calor-em-20-anos',
  },
  paraisopolis: {
    texto: 'Agência FAPESP, sobre estudo do CEFAVELA/UFABC (verão 2024/25, Landsat 8)',
    url: 'https://agencia.fapesp.br/diferenca-de-temperatura-em-favelas-e-bairros-vizinhos-da-capital-chega-a-15-0c/56591',
  },
}
