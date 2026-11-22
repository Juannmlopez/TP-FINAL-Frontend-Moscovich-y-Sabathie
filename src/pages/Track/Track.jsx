// Detalle de una canción: portada, título, artista, álbum, duración y géneros.
// Acciones: reproducir, cola, playlist, estado, favorito, puntuación y reseña.
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import * as musicService from '../../services/music.service';
import { useFetch } from '../../hooks/useFetch';
import { usePlayer } from '../../hooks/usePlayer';
import { formatDate, formatDuration } from '../../utils/format';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import Cover from '../../components/cards/Cover';
import ContentActions from '../../components/library/ContentActions';
import AddToPlaylistModal from '../../components/library/AddToPlaylistModal';
import './Track.css';

export default function Track() {
  const { id } = useParams();
  const { data, loading, error, reload } = useFetch(() => musicService.getTrack(id), [id]);
  const { playTrack, addToQueue, current, playing, togglePlay } = usePlayer();
  const [modal, setModal] = useState(false);

  if (loading) return <Spinner label="Cargando canción..." />;

  if (error) {
    return (
      <section className="track">
        <h1 className="page__title">Canción</h1>
        <ErrorMessage message={error} onRetry={reload} />
      </section>
    );
  }

  const track = data?.track;
  if (!track) {
    return (
      <section className="track">
        <h1 className="page__title">Canción</h1>
        <EmptyState title="No encontramos esta canción" />
      </section>
    );
  }

  const esActual = current?.id === track.id;

  return (
    <section className="track">
      <header className="detail-header">
        <div className="detail-header__cover">
          <Cover src={track.coverUrl} alt={`Portada de ${track.title}`} />
        </div>
        <div className="detail-header__info">
          <p className="home__eyebrow">CANCIÓN</p>
          <h1 className="detail-header__title">{track.title}</h1>
          <p className="detail-header__subtitle">{track.artistName}</p>
          <p className="field__hint">
            {[track.albumTitle, formatDate(track.releaseDate), formatDuration(track.durationMs)].filter(Boolean).join(' · ')}
          </p>
          {track.genres?.length > 0 && (
            <ul className="tag-list">
              {track.genres.map((g) => (
                <li key={g} className="tag">
                  {g}
                </li>
              ))}
            </ul>
          )}
          <div className="detail-header__actions">
            <Button onClick={() => (esActual ? togglePlay() : playTrack(track))}>
              {esActual && playing ? 'Pausar' : 'Reproducir'}
            </Button>
            <Button variant="secondary" onClick={() => addToQueue(track)}>
              Agregar a la cola
            </Button>
            <Button variant="secondary" onClick={() => setModal(true)}>
              Agregar a playlist
            </Button>
          </div>
          {!track.previewUrl && <p className="field__hint">Esta canción no tiene vista previa de audio.</p>}
        </div>
      </header>

      <ContentActions content={track} />
      <AddToPlaylistModal open={modal} onClose={() => setModal(false)} content={track} />
    </section>
  );
}
