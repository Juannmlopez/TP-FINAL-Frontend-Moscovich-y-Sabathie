// Detalle de una canción: portada, título, artista, álbum, duración, géneros y
// metadatos. Acciones: guardar en biblioteca, cambiar estado, favorito, puntuar,
// reseñar y agregar a playlist.
//
// Servicios que va a usar:
//   - services/music.service.js: getTrack
//   - services/library.service.js: addItem, updateItem, setRating
//   - services/reviews.service.js: saveReview
//   - services/collections.service.js: addItem
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import './Track.css';

export default function Track() {
  const { id } = useParams();
  // Estados de la pantalla (los setters se agregan al implementar la carga)
  const [loading] = useState(false);
  const [error] = useState('');
  const [data] = useState(null);

  // TODO: useEffect que cargue los datos cuando cambia el id, manejando loading y error

  if (loading) return <Spinner label="Cargando..." />;

  if (error) {
    return (
      <section className="track">
        <h1 className="page__title">Canción</h1>
        <ErrorMessage message={error} />
      </section>
    );
  }

  if (!data) {
    return (
      <section className="track">
        <h1 className="page__title">Canción</h1>
        <EmptyState title="No encontramos esta canción" />
      </section>
    );
  }

  return (
    <section className="track">
      <h1 className="page__title">Canción</h1>
      <p className="track__id">ID: {id}</p>
      {/* TODO: Cabecera: portada, título, artista, álbum, duración (musicService.getTrack(id)) */}
      {/* TODO: Acciones: StatusSelect, FavoriteButton, RatingStars, ReviewForm y "Agregar a playlist" (Modal) */}
    </section>
  );
}
