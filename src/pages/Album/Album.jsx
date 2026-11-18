// Detalle de un álbum: portada, título, artista, descripción, géneros, fecha y
// lista de canciones. Acciones: guardar en biblioteca, cambiar estado, favorito,
// puntuar, reseñar y agregar a playlist.
//
// Servicios que va a usar:
//   - services/music.service.js: getAlbum
//   - services/library.service.js: addItem, updateItem, setRating
//   - services/reviews.service.js: saveReview
//   - services/collections.service.js: addItem
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import './Album.css';

export default function Album() {
  const { id } = useParams();
  // Estados de la pantalla (los setters se agregan al implementar la carga)
  const [loading] = useState(false);
  const [error] = useState('');
  const [data] = useState(null);

  // TODO: useEffect que cargue los datos cuando cambia el id, manejando loading y error

  if (loading) return <Spinner label="Cargando..." />;

  if (error) {
    return (
      <section className="album">
        <h1 className="page__title">Álbum</h1>
        <ErrorMessage message={error} />
      </section>
    );
  }

  if (!data) {
    return (
      <section className="album">
        <h1 className="page__title">Álbum</h1>
        <EmptyState title="No encontramos este álbum" />
      </section>
    );
  }

  return (
    <section className="album">
      <h1 className="page__title">Álbum</h1>
      <p className="album__id">ID: {id}</p>
      {/* TODO: Cabecera: portada, título, artista, fecha, géneros (musicService.getAlbum(id)) */}
      {/* TODO: Lista de canciones con duración (formatDuration) */}
      {/* TODO: Acciones: StatusSelect, FavoriteButton, RatingStars, ReviewForm y "Agregar a playlist" (Modal) */}
    </section>
  );
}
