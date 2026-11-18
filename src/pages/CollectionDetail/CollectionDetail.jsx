// Detalle de una playlist: nombre, descripción y canciones. Permite quitar canciones.
//
// Servicios que va a usar:
//   - services/collections.service.js: getCollection, removeItem
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import './CollectionDetail.css';

export default function CollectionDetail() {
  const { id } = useParams();
  // Estados de la pantalla (los setters se agregan al implementar la carga)
  const [loading] = useState(false);
  const [error] = useState('');
  const [data] = useState(null);

  // TODO: useEffect que cargue los datos cuando cambia el id, manejando loading y error

  if (loading) return <Spinner label="Cargando..." />;

  if (error) {
    return (
      <section className="collection-detail">
        <h1 className="page__title">Playlist</h1>
        <ErrorMessage message={error} />
      </section>
    );
  }

  if (!data) {
    return (
      <section className="collection-detail">
        <h1 className="page__title">Playlist</h1>
        <EmptyState title="Esta playlist está vacía" message="Agregá canciones desde la página de cada canción o álbum." />
      </section>
    );
  }

  return (
    <section className="collection-detail">
      <h1 className="page__title">Playlist</h1>
      <p className="collection-detail__id">ID: {id}</p>
      {/* TODO: Cabecera: nombre, descripción y cantidad de canciones (collectionsService.getCollection(id)) */}
      {/* TODO: Lista de TrackCard con botón "Quitar" (collectionsService.removeItem(id, contentId)) */}
    </section>
  );
}
