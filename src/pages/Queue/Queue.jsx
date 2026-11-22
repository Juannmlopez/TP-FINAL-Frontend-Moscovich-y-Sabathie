// Cola de reproducción: lo que suena ahora, lo que sigue, y poder quitar o reordenar canciones.
// El orden se cambia con los botones subir/bajar o arrastrando una fila.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlayer } from '../../hooks/usePlayer';
import { formatDuration } from '../../utils/format';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import Cover from '../../components/cards/Cover';
import './Queue.css';

export default function Queue() {
  const { queue, index, playing, playAt, removeFromQueue, moveInQueue, clearQueue, togglePlay } = usePlayer();
  const [arrastrando, setArrastrando] = useState(null);
  const [sobre, setSobre] = useState(null);

  if (queue.length === 0) {
    return (
      <section className="queue">
        <h1 className="page__title">Cola de reproducción</h1>
        <EmptyState
          title="La cola está vacía"
          message="Reproducí una canción o agregala a la cola desde cualquier lista."
          action={<Link to="/search">Buscar música</Link>}
        />
      </section>
    );
  }

  function soltar(hasta) {
    if (arrastrando !== null) moveInQueue(arrastrando, hasta);
    setArrastrando(null);
    setSobre(null);
  }

  return (
    <section className="queue">
      <header className="page__header">
        <h1 className="page__title">Cola de reproducción</h1>
        <Button variant="ghost" onClick={clearQueue}>
          Vaciar cola
        </Button>
      </header>
      <p className="field__hint">
        {queue.length} {queue.length === 1 ? 'canción' : 'canciones'} · Arrastrá o usá las flechas para cambiar el orden
      </p>

      <ol className="queue__list">
        {queue.map((track, i) => {
          const actual = i === index;
          return (
            <li
              key={`${track.id}-${i}`}
              className={`queue__item ${actual ? 'queue__item--current' : ''} ${sobre === i ? 'queue__item--over' : ''}`}
              draggable
              onDragStart={() => setArrastrando(i)}
              onDragOver={(event) => {
                event.preventDefault();
                setSobre(i);
              }}
              onDrop={() => soltar(i)}
              onDragEnd={() => {
                setArrastrando(null);
                setSobre(null);
              }}
            >
              <span className="queue__grip" aria-hidden="true">
                ⠿
              </span>
              <button
                type="button"
                className="track-row__play"
                onClick={() => (actual ? togglePlay() : playAt(i))}
                aria-label={actual && playing ? `Pausar ${track.title}` : `Reproducir ${track.title}`}
              >
                {actual && playing ? '❚❚' : actual ? '▶' : i + 1}
              </button>
              <span className="track-row__cover">
                <Cover src={track.coverUrl} alt="" />
              </span>
              <span className="track-row__text">
                <Link to={`/track/${track.externalId}`} className="track-row__title">
                  {track.title}
                </Link>
                <span className="track-row__artist">{track.artistName}</span>
              </span>
              <span className="track-row__duration">{formatDuration(track.durationMs)}</span>
              <span className="track-row__actions">
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => moveInQueue(i, i - 1)}
                  disabled={i === 0}
                  aria-label={`Subir ${track.title}`}
                >
                  ▲
                </button>
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => moveInQueue(i, i + 1)}
                  disabled={i === queue.length - 1}
                  aria-label={`Bajar ${track.title}`}
                >
                  ▼
                </button>
                <button
                  type="button"
                  className="icon-button icon-button--danger"
                  onClick={() => removeFromQueue(i)}
                  aria-label={`Quitar ${track.title} de la cola`}
                >
                  ✕
                </button>
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
