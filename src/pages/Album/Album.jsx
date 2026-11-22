// Detalle de un álbum: portada, título, artista, géneros, fecha y lista de canciones.
// Acciones: reproducir el álbum, guardarlo en la biblioteca, estado, favorito, puntuar y reseñar.
import { useParams } from 'react-router-dom';
import * as musicService from '../../services/music.service';
import { useFetch } from '../../hooks/useFetch';
import { usePlayer } from '../../hooks/usePlayer';
import { formatDate, formatMinutes } from '../../utils/format';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import Cover from '../../components/cards/Cover';
import TrackRow from '../../components/cards/TrackRow';
import ContentActions from '../../components/library/ContentActions';
import './Album.css';

export default function Album() {
  const { id } = useParams();
  const { data, loading, error, reload } = useFetch(() => musicService.getAlbum(id), [id]);
  const { playList, toggleShuffle, shuffle } = usePlayer();

  if (loading) return <Spinner label="Cargando álbum..." />;

  if (error) {
    return (
      <section className="album">
        <h1 className="page__title">Álbum</h1>
        <ErrorMessage message={error} onRetry={reload} />
      </section>
    );
  }

  const album = data?.album;
  const tracks = data?.tracks || [];
  if (!album) {
    return (
      <section className="album">
        <h1 className="page__title">Álbum</h1>
        <EmptyState title="No encontramos este álbum" />
      </section>
    );
  }

  const totalMin = tracks.reduce((acc, t) => acc + (t.durationMs || 0), 0) / 60000;

  function reproducirTodo(aleatorio) {
    if (aleatorio && !shuffle) toggleShuffle();
    if (!aleatorio && shuffle) toggleShuffle();
    playList(tracks, aleatorio ? Math.floor(Math.random() * tracks.length) : 0);
  }

  return (
    <section className="album">
      <header className="detail-header">
        <div className="detail-header__cover">
          <Cover src={album.coverUrl} alt={`Portada de ${album.title}`} />
        </div>
        <div className="detail-header__info">
          <p className="home__eyebrow">ÁLBUM</p>
          <h1 className="detail-header__title">{album.title}</h1>
          <p className="detail-header__subtitle">{album.artistName}</p>
          <p className="field__hint">
            {[formatDate(album.releaseDate), `${tracks.length} canciones`, totalMin > 0 && formatMinutes(totalMin)]
              .filter(Boolean)
              .join(' · ')}
          </p>
          {album.genres?.length > 0 && (
            <ul className="tag-list">
              {album.genres.map((g) => (
                <li key={g} className="tag">
                  {g}
                </li>
              ))}
            </ul>
          )}
          <div className="detail-header__actions">
            <Button onClick={() => reproducirTodo(false)} disabled={tracks.length === 0}>
              Reproducir álbum
            </Button>
            <Button variant="secondary" onClick={() => reproducirTodo(true)} disabled={tracks.length === 0}>
              Aleatorio
            </Button>
          </div>
        </div>
      </header>

      <ContentActions content={album} />

      <h2 className="home__heading">Canciones</h2>
      {tracks.length === 0 ? (
        <EmptyState title="Este álbum no tiene canciones" />
      ) : (
        <ol className="track-list">
          {tracks.map((track, i) => (
            <TrackRow key={track.id} track={track} number={i + 1} onPlay={() => playList(tracks, i)} />
          ))}
        </ol>
      )}
    </section>
  );
}
