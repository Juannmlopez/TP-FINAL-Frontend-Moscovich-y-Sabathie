// Botones del reproductor: aleatorio, anterior, play/pausa, siguiente y bucle.
// Se usa en la barra inferior y en la pantalla de reproducción.
import { usePlayer } from '../../hooks/usePlayer';

const ETIQUETA_BUCLE = {
  off: 'Bucle desactivado',
  all: 'Repetir cola',
  one: 'Repetir canción',
};

export default function PlayerControls({ large = false }) {
  const { current, playing, buffering, shuffle, repeat, togglePlay, next, prev, toggleShuffle, cycleRepeat } =
    usePlayer();
  const sinCancion = !current;

  return (
    <div className={`player-controls ${large ? 'player-controls--large' : ''}`}>
      <button
        type="button"
        className={`player-controls__btn ${shuffle ? 'player-controls__btn--active' : ''}`}
        onClick={toggleShuffle}
        aria-pressed={shuffle}
        aria-label={shuffle ? 'Desactivar reproducción aleatoria' : 'Activar reproducción aleatoria'}
        title="Aleatorio"
      >
        ⇄
      </button>
      <button type="button" className="player-controls__btn" onClick={prev} disabled={sinCancion} aria-label="Canción anterior">
        ⏮
      </button>
      <button
        type="button"
        className="player-controls__play"
        onClick={togglePlay}
        disabled={sinCancion}
        aria-label={playing ? 'Pausar' : 'Reproducir'}
      >
        {buffering && playing ? '…' : playing ? '❚❚' : '▶'}
      </button>
      <button type="button" className="player-controls__btn" onClick={next} disabled={sinCancion} aria-label="Canción siguiente">
        ⏭
      </button>
      <button
        type="button"
        className={`player-controls__btn ${repeat !== 'off' ? 'player-controls__btn--active' : ''}`}
        onClick={cycleRepeat}
        aria-label={ETIQUETA_BUCLE[repeat]}
        title={ETIQUETA_BUCLE[repeat]}
      >
        {repeat === 'one' ? '🔂' : '🔁'}
      </button>
    </div>
  );
}
