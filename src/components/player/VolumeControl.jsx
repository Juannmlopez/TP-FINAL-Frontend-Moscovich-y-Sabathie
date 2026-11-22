// Control de volumen con botón de silencio
import { useRef } from 'react';
import { usePlayer } from '../../hooks/usePlayer';

export default function VolumeControl() {
  const { volume, setVolume } = usePlayer();
  const anteriorRef = useRef(0.8); // volumen antes de silenciar

  function toggleMute() {
    if (volume > 0) {
      anteriorRef.current = volume;
      setVolume(0);
    } else {
      setVolume(anteriorRef.current || 0.8);
    }
  }

  return (
    <div className="volume">
      <button
        type="button"
        className="player-controls__btn"
        onClick={toggleMute}
        aria-label={volume > 0 ? 'Silenciar' : 'Activar sonido'}
      >
        {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
      </button>
      <input
        type="range"
        className="progress__range volume__range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(event) => setVolume(Number(event.target.value))}
        aria-label="Volumen"
        style={{ '--fill': `${volume * 100}%` }}
      />
    </div>
  );
}
