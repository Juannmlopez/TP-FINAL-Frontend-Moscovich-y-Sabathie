// Detalle de un artista: foto, nombre, fans y discografía.
// Acciones: guardar en la biblioteca, estado, favorito, puntuar y reseñar.
import { useParams } from 'react-router-dom';
import * as musicService from '../../services/music.service';
import { useFetch } from '../../hooks/useFetch';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import Cover from '../../components/cards/Cover';
import AlbumCard from '../../components/cards/AlbumCard';
import ContentActions from '../../components/library/ContentActions';
import './Artist.css';

export default function Artist() {
  const { id } = useParams();
  const { data, loading, error, reload } = useFetch(
    () => Promise.all([musicService.getArtist(id), musicService.getArtistAlbums(id).catch(() => ({ albums: [] }))]),
    [id]
  );

  if (loading) return <Spinner label="Cargando artista..." />;

  if (error) {
    return (
      <section className="artist">
        <h1 className="page__title">Artista</h1>
        <ErrorMessage message={error} onRetry={reload} />
      </section>
    );
  }

  const artist = data?.[0]?.artist;
  const albums = data?.[1]?.albums || [];
  if (!artist) {
    return (
      <section className="artist">
        <h1 className="page__title">Artista</h1>
        <EmptyState title="No encontramos este artista" />
      </section>
    );
  }

  return (
    <section className="artist">
      <header className="detail-header">
        <div className="detail-header__cover detail-header__cover--round">
          <Cover src={artist.coverUrl} alt={`Foto de ${artist.title}`} round />
        </div>
        <div className="detail-header__info">
          <p className="home__eyebrow">ARTISTA</p>
          <h1 className="detail-header__title">{artist.title}</h1>
          <p className="field__hint">
            {[
              artist.fans != null && `${artist.fans.toLocaleString('es-AR')} fans`,
              artist.albumsCount != null && `${artist.albumsCount} álbumes`,
            ]
              .filter(Boolean)
              .join(' · ')}
          </p>
        </div>
      </header>

      <ContentActions content={artist} />

      <h2 className="home__heading">Discografía</h2>
      {albums.length === 0 ? (
        <EmptyState title="Sin álbumes para mostrar" />
      ) : (
        <div className="card-grid">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      )}
    </section>
  );
}
