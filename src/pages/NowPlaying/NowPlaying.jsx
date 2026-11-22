// Pantalla de reproducción: portada grande de la canción actual con todos los controles
import { Link } from 'react-router-dom';
import { usePlayer } from '../../hooks/usePlayer';
import Cover from '../../components/cards/Cover';
import EmptyState from '../../components/ui/EmptyState';
import PlayerControls from '../../components/player/PlayerControls';
import ProgressBar from '../../components/player/ProgressBar';
import VolumeControl from '../../components/player/VolumeControl';
import './NowPlaying.css';

export default function NowPlaying() {
  const { current, queue, index, error } = usePlayer();

  if (!current) {
    return (
      <section className="now-playing">
        <h1 className="page__title">Reproduciendo</h1>
        <EmptyState
          title="No hay nada sonando"
          message="Elegí una canción para empezar a escuchar."
          action={<Link to="/search">Buscar música</Link>}
        />
      </section>
    );
  }

  const siguiente = queue[index + 1];

  return (
    <section className="now-playing">
      <h1 className="sr-only">Reproduciendo</h1>
      <div className="now-playing__cover">
        <Cover src={current.coverUrl} alt={`Portada de ${current.title}`} />
      </div>
      <div className="now-playing__info">
        <Link to={`/track/${current.externalId}`} className="now-playing__title">
          {current.title}
        </Link>
        <p className="now-playing__artist">{current.artistName}</p>
        {error && (
          <p className="field__error" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="now-playing__controls">
        <ProgressBar />
        <PlayerControls large />
        <VolumeControl />
      </div>

      <p className="field__hint">
        {siguiente ? `A continuación: ${siguiente.title} · ${siguiente.artistName}` : 'Es la última canción de la cola'}{' '}
        <Link to="/queue">Ver cola</Link>
      </p>
    </section>
  );
}
