// Playlists del usuario: crear, renombrar y borrar. Cada una lleva a /collections/:id.
//
// Servicios que va a usar:
//   - services/collections.service.js: getCollections, createCollection, updateCollection, deleteCollection
import { useState } from 'react';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import './Collections.css';

export default function Collections() {
  // Estados de la pantalla (los setters se agregan al implementar la carga)
  const [loading] = useState(false);
  const [error] = useState('');
  const [data] = useState(null);

  // TODO: useEffect que cargue los datos al montar, manejando loading y error

  if (loading) return <Spinner label="Cargando..." />;

  if (error) {
    return (
      <section className="collections">
        <h1 className="page__title">Mis playlists</h1>
        <ErrorMessage message={error} />
      </section>
    );
  }

  if (!data) {
    return (
      <section className="collections">
        <h1 className="page__title">Mis playlists</h1>
        <EmptyState title="Todavía no tenés playlists" message="Creá la primera para empezar a organizar tu música." />
      </section>
    );
  }

  return (
    <section className="collections">
      <h1 className="page__title">Mis playlists</h1>
      {/* TODO: Botón "Nueva playlist" que abre un Modal con el nombre (1 a 80 caracteres) */}
      {/* TODO: Grilla de CollectionCard (collectionsService.getCollections()) */}
      {/* TODO: Renombrar (Modal + updateCollection) y borrar (Modal de confirmación + deleteCollection) */}
    </section>
  );
}
