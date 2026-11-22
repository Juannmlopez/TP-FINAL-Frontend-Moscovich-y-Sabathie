// Listado de artistas: los populares del momento (chart de Deezer) y los que guardaste en tu biblioteca
import * as musicService from '../../services/music.service';
import * as libraryService from '../../services/library.service';
import { useFetch } from '../../hooks/useFetch';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import ArtistCard from '../../components/cards/ArtistCard';

async function pedirArtistas() {
  const [featured, biblioteca] = await Promise.allSettled([musicService.getFeatured(), libraryService.getLibrary()]);
  if (featured.status === 'rejected') throw featured.reason;
  return {
    populares: featured.value.artists || [],
    guardados: biblioteca.status === 'fulfilled' ? biblioteca.value.items.filter((i) => i.type === 'artist') : [],
  };
}

export default function Artists() {
  const { data, loading, error, reload } = useFetch(pedirArtistas, []);

  if (loading) return <Spinner label="Cargando artistas..." />;

  return (
    <section className="artists">
      <h1 className="page__title">Artistas</h1>
      {error ? (
        <ErrorMessage message={error} onRetry={reload} />
      ) : (
        <>
          {data.guardados.length > 0 && (
            <>
              <h2 className="home__heading">En tu biblioteca</h2>
              <div className="card-grid">
                {data.guardados.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            </>
          )}
          <h2 className="home__heading">Artistas populares</h2>
          {data.populares.length === 0 ? (
            <EmptyState title="No hay artistas para mostrar" />
          ) : (
            <div className="card-grid">
              {data.populares.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
