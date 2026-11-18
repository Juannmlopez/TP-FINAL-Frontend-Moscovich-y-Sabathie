// Detalle de un artista: imagen, nombre, descripción, géneros y metadatos,
// más su discografía. Acciones: guardar en biblioteca, cambiar estado, favorito,
// puntuar y reseñar.
//
// Servicios que va a usar:
//   - services/music.service.js: getArtist, getArtistAlbums
//   - services/library.service.js: addItem, updateItem, setRating
//   - services/reviews.service.js: saveReview
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import './Artist.css';

export default function Artist() {
  const { id } = useParams();
  // Estados de la pantalla (los setters se agregan al implementar la carga)
  const [loading] = useState(false);
  const [error] = useState('');
  const [data] = useState(null);

  // TODO: useEffect que cargue los datos cuando cambia el id, manejando loading y error

  if (loading) return <Spinner label="Cargando..." />;

  if (error) {
    return (
      <section className="artist">
        <h1 className="page__title">Artista</h1>
        <ErrorMessage message={error} />
      </section>
    );
  }

  if (!data) {
    return (
      <section className="artist">
        <h1 className="page__title">Artista</h1>
        <EmptyState title="No encontramos este artista" />
      </section>
    );
  }

  return (
    <section className="artist">
      <h1 className="page__title">Artista</h1>
      <p className="artist__id">ID: {id}</p>
      {/* TODO: Cabecera: imagen, nombre, géneros y metadatos (musicService.getArtist(id)) */}
      {/* TODO: Discografía: AlbumCard por cada álbum (musicService.getArtistAlbums(id)) */}
      {/* TODO: Acciones: StatusSelect, FavoriteButton, RatingStars y ReviewForm */}
    </section>
  );
}
