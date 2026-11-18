// Biblioteca del usuario: lista de contenidos guardados con filtros por estado,
// favoritos y tipo, y ordenamiento (fecha agregada, título, puntuación).
//
// Servicios que va a usar:
//   - services/library.service.js: getLibrary, updateItem, removeItem
import { useState } from 'react';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import './Library.css';

export default function Library() {
  // Estados de la pantalla (los setters se agregan al implementar la carga)
  const [loading] = useState(false);
  const [error] = useState('');
  const [data] = useState(null);

  // TODO: useEffect que cargue los datos al montar, manejando loading y error

  if (loading) return <Spinner label="Cargando..." />;

  if (error) {
    return (
      <section className="library">
        <h1 className="page__title">Mi biblioteca</h1>
        <ErrorMessage message={error} />
      </section>
    );
  }

  if (!data) {
    return (
      <section className="library">
        <h1 className="page__title">Mi biblioteca</h1>
        <EmptyState title="Tu biblioteca está vacía" message="Guardá canciones, álbumes o artistas desde la búsqueda." />
      </section>
    );
  }

  return (
    <section className="library">
      <h1 className="page__title">Mi biblioteca</h1>
      {/* TODO: Filtros: estado (STATUSES), solo favoritos, tipo (CONTENT_TYPES) y orden */}
      {/* TODO: Cargar con libraryService.getLibrary(filtros) cada vez que cambian */}
      {/* TODO: Lista: TrackCard / AlbumCard / ArtistCard con StatusSelect y FavoriteButton */}
      {/* TODO: Botón para quitar de la biblioteca (libraryService.removeItem) */}
    </section>
  );
}
