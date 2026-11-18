// Búsqueda en el catálogo: texto libre, filtro por tipo (canción, álbum, artista)
// y ordenamiento. Cada resultado lleva a /track/:id, /album/:id o /artist/:id.
//
// Servicios que va a usar:
//   - services/music.service.js: search
import { useState } from 'react';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import './Search.css';

export default function Search() {
  // Estados de la pantalla (los setters se agregan al implementar la carga)
  const [loading] = useState(false);
  const [error] = useState('');
  const [data] = useState(null);

  // TODO: useEffect que cargue los datos al montar, manejando loading y error

  if (loading) return <Spinner label="Cargando..." />;

  if (error) {
    return (
      <section className="search">
        <h1 className="page__title">Buscar</h1>
        <ErrorMessage message={error} />
      </section>
    );
  }

  if (!data) {
    return (
      <section className="search">
        <h1 className="page__title">Buscar</h1>
        <EmptyState title="Sin resultados" message="Probá con otra búsqueda o cambiá el filtro." />
      </section>
    );
  }

  return (
    <section className="search">
      <h1 className="page__title">Buscar</h1>
      {/* TODO: Formulario: Input de texto + select de tipo (CONTENT_TYPES) + select de orden */}
      {/* TODO: Al enviar: musicService.search({ q, type, sort }) y guardar los resultados */}
      {/* TODO: Resultados: TrackCard / AlbumCard / ArtistCard según el tipo */}
    </section>
  );
}
