// Lista de actividad reciente del usuario (la devuelve /api/activity). Se usa en Home y Perfil.
// Props: activities ([{ id, type, details, content, collection, createdAt }])
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/format';

const ESTADOS = {
  quiero_escuchar: 'Quiero escuchar',
  escuchando: 'Escuchando',
  escuchado: 'Escuchado',
  favorito: 'Favorito',
};

// Texto de cada tipo de actividad; "algo" es el contenido o la playlist involucrada
function describir(a, algo) {
  switch (a.type) {
    case 'library_add':
      return ['Guardaste', algo, 'en tu biblioteca'];
    case 'library_remove':
      return ['Quitaste', algo, 'de tu biblioteca'];
    case 'status_change':
      return ['Marcaste', algo, `como "${ESTADOS[a.details?.to] || a.details?.to}"`];
    case 'favorite_add':
      return ['Agregaste', algo, 'a favoritos'];
    case 'favorite_remove':
      return ['Quitaste', algo, 'de favoritos'];
    case 'rating_set':
      return ['Puntuaste', algo, `con ${a.details?.score} ${a.details?.score === 1 ? 'estrella' : 'estrellas'}`];
    case 'rating_remove':
      return ['Quitaste la puntuación de', algo, ''];
    case 'review_create':
      return ['Escribiste una reseña de', algo, ''];
    case 'review_update':
      return ['Editaste tu reseña de', algo, ''];
    case 'review_delete':
      return ['Borraste tu reseña de', algo, ''];
    case 'collection_create':
      return ['Creaste la playlist', algo, ''];
    case 'collection_update':
      return ['Editaste la playlist', algo, ''];
    case 'collection_delete':
      return ['Borraste la playlist', algo, ''];
    case 'collection_add_item':
      return ['Agregaste', algo, a.collection ? `a ${a.collection.name}` : 'a una playlist'];
    case 'collection_remove_item':
      return ['Quitaste', algo, a.collection ? `de ${a.collection.name}` : 'de una playlist'];
    case 'profile_update':
      return ['Actualizaste tu perfil', null, ''];
    default:
      return [a.type, algo, ''];
  }
}

export default function ActivityList({ activities = [], limit }) {
  const lista = limit ? activities.slice(0, limit) : activities;
  if (lista.length === 0) return <p className="field__hint">Todavía no hay actividad.</p>;

  return (
    <ul className="activity-list">
      {lista.map((a) => {
        const c = a.content;
        const nombre = c?.title || a.collection?.name || a.details?.name;
        const ruta = c?.externalId && c.type ? `/${c.type}/${c.externalId}` : a.collection ? `/collections/${a.collection.id}` : null;
        const algo = nombre ? (ruta ? <Link to={ruta}>{nombre}</Link> : <strong>{nombre}</strong>) : null;
        const [antes, , despues] = describir(a, algo);
        return (
          <li key={a.id} className="activity-list__item">
            <span>
              {antes} {algo} {despues}
            </span>
            <span className="field__hint">{formatDate(a.createdAt)}</span>
          </li>
        );
      })}
    </ul>
  );
}
