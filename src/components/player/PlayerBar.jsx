// Barra fija inferior con la canción que suena. Solo aparece si hay algo en la cola.
import { Link } from 'react-router-dom';
import { usePlayer } from '../../hooks/usePlayer';
import Cover from '../cards/Cover';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';

export default function PlayerBar() {
  const { current, error, queue } = usePlayer();
  if (!current) return null;

  return (
    <aside className="player-bar" aria-label="Reproductor">
      <Link to="/now-playing" className="player-bar__info">
        <span className="player-bar__cover">
          <Cover src={current.coverUrl} alt="" />
        </span>
        <span className="player-bar__text">
          <span className="player-bar__title">{current.title}</span>
          <span className="player-bar__artist">{error || current.artistName}</span>
        </span>
      </Link>

      <div className="player-bar__center">
        <PlayerControls />
        <ProgressBar />
      </div>

      <div className="player-bar__right">
        <Link to="/queue" className="player-bar__queue" aria-label="Ver cola de reproducción">
          ☰ <span>Cola ({queue.length})</span>
        </Link>
        <VolumeControl />
      </div>
    </aside>
  );
}
