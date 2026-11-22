// Detalle de una playlist: nombre, descripción y canciones. Permite reproducirla y quitar canciones.
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as collectionsService from '../../services/collections.service';
import { useFetch } from '../../hooks/useFetch';
import { usePlayer } from '../../hooks/usePlayer';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import TrackRow from '../../components/cards/TrackRow';
import './CollectionDetail.css';

export default function CollectionDetail() {
  const { id } = useParams();
  const { data, loading, error, reload, setData } = useFetch(() => collectionsService.getCollection(id), [id]);
  const { playList, toggleShuffle, shuffle } = usePlayer();
  const [errorAccion, setErrorAccion] = useState('');

  if (loading) return <Spinner label="Cargando playlist..." />;

  if (error) {
    return (
      <section className="collection-detail">
        <h1 className="page__title">Playlist</h1>
        <ErrorMessage message={error} onRetry={reload} />
        <p>
          <Link to="/collections">Volver a mis playlists</Link>
        </p>
      </section>
    );
  }

  const collection = data?.collection;
  if (!collection) {
    return (
      <section className="collection-detail">
        <h1 className="page__title">Playlist</h1>
        <EmptyState title="No encontramos esta playlist" />
      </section>
    );
  }

  const items = collection.items || [];
  const tracks = items.filter((item) => item.type === 'track');

  async function quitar(item) {
    setErrorAccion('');
    try {
      await collectionsService.removeItem(id, item.id);
      const restantes = items.filter((i) => i.id !== item.id);
      setData({ collection: { ...collection, items: restantes, itemCount: restantes.length } });
    } catch (err) {
      setErrorAccion(err.message);
    }
  }

  function reproducir(aleatorio) {
    if (aleatorio !== shuffle) toggleShuffle();
    playList(tracks, aleatorio ? Math.floor(Math.random() * tracks.length) : 0);
  }

  return (
    <section className="collection-detail">
      <p>
        <Link to="/collections">‹ Mis playlists</Link>
      </p>
      <header className="detail-header detail-header--compact">
        <div className="detail-header__info">
          <p className="home__eyebrow">PLAYLIST</p>
          <h1 className="detail-header__title">{collection.name}</h1>
          {collection.description && <p className="detail-header__subtitle">{collection.description}</p>}
          <p className="field__hint">{items.length === 1 ? '1 canción' : `${items.length} canciones`}</p>
          <div className="detail-header__actions">
            <Button onClick={() => reproducir(false)} disabled={tracks.length === 0}>
              Reproducir
            </Button>
            <Button variant="secondary" onClick={() => reproducir(true)} disabled={tracks.length === 0}>
              Aleatorio
            </Button>
          </div>
        </div>
      </header>

      <ErrorMessage message={errorAccion} />

      {items.length === 0 ? (
        <EmptyState title="Esta playlist está vacía" message="Agregá canciones desde la página de cada canción o álbum." />
      ) : (
        <ol className="track-list">
          {items.map((item, i) => (
            <TrackRow
              key={item.id}
              track={item}
              number={i + 1}
              showCover
              onPlay={() => playList(tracks, tracks.findIndex((t) => t.id === item.id))}
              extra={
                <button
                  type="button"
                  className="icon-button icon-button--danger"
                  onClick={() => quitar(item)}
                  aria-label={`Quitar ${item.title} de la playlist`}
                  title="Quitar de la playlist"
                >
                  ✕
                </button>
              }
            />
          ))}
        </ol>
      )}
    </section>
  );
}
