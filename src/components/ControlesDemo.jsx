// Controles do modo demonstração: pausar, avançar uma passagem e mudar a velocidade.
// Deixa claro que o tempo é acelerado: na rua, um ônibus leva vários minutos entre passagens.
//
// Props: pausado, aoPausar, aoAvancar, velocidade, aoMudarVelocidade, bloqueado (sem conexão),
// automaticoLigado e aoAlternarAutomatico (liga/desliga a criação de chamados automáticos).
import { VELOCIDADES } from '../utils/simulacao.js'
import { PASSAGENS_PARA_CHAMADO } from '../utils/regras.js'

const BOTAO = 'min-h-11 border-2 border-asfalto px-3 text-sm font-bold disabled:opacity-60'

function ControlesDemo({
  pausado,
  aoPausar,
  aoAvancar,
  velocidade,
  aoMudarVelocidade,
  bloqueado,
  automaticoLigado,
  aoAlternarAutomatico,
}) {
  const atual = VELOCIDADES.find((v) => v.id === velocidade)

  return (
    <section aria-labelledby="titulo-demo" className="border-2 border-dashed border-asfalto bg-white p-3">
      <h2 id="titulo-demo" className="text-sm font-bold uppercase">Modo demonstração</h2>
      <p className="mt-1 text-sm">
        Simulação acelerada: 1 passagem a cada {(atual.intervaloMs / 1000).toLocaleString('pt-BR')} s. Na rua, são vários minutos.
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={aoPausar} disabled={bloqueado} className={`${BOTAO} bg-asfalto text-white`}>
          {pausado ? 'Continuar' : 'Pausar'}
        </button>
        {/* Só faz sentido avançar na mão quando está pausado */}
        <button type="button" onClick={aoAvancar} disabled={!pausado || bloqueado} className={`${BOTAO} bg-white`}>
          Avançar passagem
        </button>

        <span className="ml-1 text-sm font-semibold" id="rotulo-velocidade">Velocidade:</span>
        <div role="group" aria-labelledby="rotulo-velocidade" className="flex flex-wrap gap-2">
          {VELOCIDADES.map((v) => (
            <button
              key={v.id}
              type="button"
              aria-pressed={v.id === velocidade}
              onClick={() => aoMudarVelocidade(v.id)}
              className={`${BOTAO} ${v.id === velocidade ? 'bg-asfalto text-white' : 'bg-white'}`}
            >
              {v.rotulo}
            </button>
          ))}
        </div>
      </div>

      {/* Chave do chamado automático. aria-pressed diz ao leitor de tela se está ligada. */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          aria-pressed={automaticoLigado}
          onClick={aoAlternarAutomatico}
          className={`${BOTAO} ${automaticoLigado ? 'bg-critico text-white' : 'bg-white'}`}
        >
          Chamado automático: {automaticoLigado ? 'ligado' : 'desligado'}
        </button>
        <p className="text-sm">
          {automaticoLigado
            ? `Na ${PASSAGENS_PARA_CHAMADO}ª passagem crítica seguida, o app abre um chamado na API.`
            : `Ligue para a regra da ${PASSAGENS_PARA_CHAMADO}ª passagem criar chamados na API.`}
        </p>
      </div>
    </section>
  )
}

export default ControlesDemo
