// Controles do modo demonstração: pausar, adiantar 15 segundos e mudar a velocidade.
// Na velocidade 1x cada ônibus leva 3 minutos para percorrer a sua rua (uma passagem).
// Para ver a regra da 6ª passagem acontecer, use 10x: cada passagem leva 18 segundos.
//
// Props: passagem (a menor entre os 6 ônibus), pausado, aoPausar, aoAvancar, velocidade,
// aoMudarVelocidade, bloqueado (sem conexão), automaticoLigado e aoAlternarAutomatico.
import { VELOCIDADES } from '../utils/simulacao.js'
import { PASSAGENS_PARA_CHAMADO } from '../utils/regras.js'
import { DURACAO_PASSAGEM_MS } from '../utils/rota.js'

const BOTAO = 'min-h-11 border-2 border-asfalto px-3 text-sm font-bold disabled:opacity-60'

function ControlesDemo({
  passagem,
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
  // Quanto tempo de verdade leva uma passagem nesta velocidade, e as 6 passagens da regra.
  const segundosPorPassagem = DURACAO_PASSAGEM_MS / 1000 / atual.fator
  const minutosAteRegra = (segundosPorPassagem * PASSAGENS_PARA_CHAMADO) / 60

  return (
    // <details> é uma caixa que abre e fecha sozinha (sem JavaScript). Começa fechada.
    <details className="border-2 border-dashed border-asfalto bg-white">
      <summary className="flex min-h-11 cursor-pointer flex-wrap items-center gap-x-3 px-3 text-sm font-bold uppercase">
        Modo demonstração
        <span className="font-normal normal-case">
          Passagem {passagem} · {pausado ? 'pausado' : `velocidade ${atual.rotulo}`} · chamado automático{' '}
          {automaticoLigado ? 'ligado' : 'desligado'}
        </span>
      </summary>
      <div className="border-t-2 border-dashed border-asfalto p-3">
      <p className="text-sm">
        Cada rua tem um ônibus com sensor. Nesta velocidade, cada um leva{' '}
        {segundosPorPassagem.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} s para percorrer a rua inteira.
        As {PASSAGENS_PARA_CHAMADO} passagens da regra do chamado automático levam uns{' '}
        {minutosAteRegra.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} min.
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={aoPausar} disabled={bloqueado} className={`${BOTAO} bg-asfalto text-white`}>
          {pausado ? 'Continuar' : 'Pausar'}
        </button>
        <button type="button" onClick={aoAvancar} disabled={bloqueado} className={`${BOTAO} bg-white`}>
          Adiantar 15 s
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
      </div>
    </details>
  )
}

export default ControlesDemo
