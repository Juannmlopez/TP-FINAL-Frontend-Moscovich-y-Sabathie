// Fila de canción para listas (álbum, playlist, biblioteca, resultados): botón de reproducir,
// título, artista, duración y acciones (cola y playlist).
// Props: track, number (posición a mostrar), onPlay (se llama al tocar reproducir),
//        extra (botones propios de la lista, ej. "Quitar")
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlayer } from '../../hooks/usePlayer';
import { formatDuration } from '../../utils/format';
import AddToPlaylistModal from '../library/AddToPlaylistModal';
import Cover from './Cover';

export default function TrackRow({ track, number, onPlay, extra, showCover = false }) {
  const { current, playing, togglePlay, addToQueue, playNext } = usePlayer();
  const [modal, setModal] = useState(false);
  const [aviso, setAviso] = useState('');
  const esActual = current?.id === track.id;

  function handlePlay() {
    if (esActual) togglePlay();
    else onPlay?.();
  }

  function avisar(texto) {
    setAviso(texto);
    setTimeout(() => setAviso(''), 2000);
  }

  return (
    <li className={`track-row ${esActual ? 'track-row--active' : ''}`}>
      <button
        type="button"
        className="track-row__play"
        onClick={handlePlay}
        aria-label={esActual && playing ? `Pausar ${track.title}` : `Reproducir ${track.title}`}
      >
        {esActual && playing ? '❚❚' : number ?? '▶'}
      </button>
      {showCover && (
        <span className="track-row__cover">
          <Cover src={track.coverUrl} alt="" />
        </span>
      )}
      <span className="track-row__text">
        <Link to={`/track/${track.externalId}`} className="track-row__title">
          {track.title}
        </Link>
        <span className="track-row__artist">
          {track.explicit && <span className="search__explicit">E</span>}
          {track.artistName}
        </span>
      </span>
      <span className="track-row__duration">{aviso || formatDuration(track.durationMs)}</span>
      <span className="track-row__actions">
        <button
          type="button"
          className="icon-button"
          onClick={() => {
            addToQueue(track);
            avisar('En la cola');
          }}
          aria-label={`Agregar ${track.title} a la cola`}
          title="Agregar a la cola"
        >
          ＋
        </button>
        <button
          type="button"
          className="icon-button"
          onClick={() => {
            playNext(track);
            avisar('Sigue después');
          }}
          aria-label={`Reproducir ${track.title} a continuación`}
          title="Reproducir a continuación"
        >
          ⤵
        </button>
        <button
          type="button"
          className="icon-button"
          onClick={() => setModal(true)}
          aria-label={`Agregar ${track.title} a una playlist`}
          title="Agregar a playlist"
        >
          ♫
        </button>
        {extra}
      </span>
      {modal && <AddToPlaylistModal open={modal} onClose={() => setModal(false)} content={track} />}
    </li>
  );
}
