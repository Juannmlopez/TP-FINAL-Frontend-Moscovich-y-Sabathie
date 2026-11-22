// Barra de progreso de la canción actual: se puede arrastrar para adelantar o retroceder
import { usePlayer } from '../../hooks/usePlayer';
import { formatTime } from '../../utils/format';

export default function ProgressBar() {
  const { current, currentTime, duration, seek } = usePlayer();
  const max = duration || 30; // los previews duran 30 s

  return (
    <div className="progress">
      <span className="progress__time">{formatTime(currentTime)}</span>
      <input
        type="range"
        className="progress__range"
        min={0}
        max={max}
        step={0.1}
        value={Math.min(currentTime, max)}
        onChange={(event) => seek(Number(event.target.value))}
        disabled={!current}
        aria-label="Progreso de la canción"
        style={{ '--fill': `${(Math.min(currentTime, max) / max) * 100}%` }}
      />
      <span className="progress__time">{formatTime(duration)}</span>
    </div>
  );
}
