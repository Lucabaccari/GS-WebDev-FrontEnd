// A linha de ônibus simulada, com os 6 trechos onde os sensores medem.
// Os trechos ainda precisam ser confirmados com a equipe.
// O "id" é o mesmo número que vai no campo "trechoId" do chamado na API.

export const LINHA = {
  nome: 'Linha Pulso',
  aviso: 'Dados simulados',
}

export const TRECHOS = [
  { id: 1, nome: 'Av. Paulista' },
  { id: 2, nome: 'R. Augusta' },
  { id: 3, nome: 'R. da Consolação' },
  { id: 4, nome: 'Av. Rebouças' },
  { id: 5, nome: 'R. Oscar Freire' },
  { id: 6, nome: 'Av. Brig. Luís Antônio' },
]

// Procura um trecho pelo id. Devolve undefined se não existir.
export function buscarTrecho(id) {
  return TRECHOS.find((trecho) => trecho.id === Number(id))
}
