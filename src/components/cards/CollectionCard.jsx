// Tarjeta de playlist: portada, nombre y cantidad de canciones. Lleva a /collections/:id.
// Se usa en Collections y Home.
// Props: collection ({ id, name, coverUrl, itemCount }), onRename, onDelete
import { Link } from 'react-router-dom';
import Cover from './Cover';

export default function CollectionCard({ collection, onRename, onDelete }) {
  if (!collection) return null;
  const cantidad = collection.itemCount ?? 0;

  return (
    <article className="card card--collection">
      <Link to={`/collections/${collection.id}`} className="card__link">
        <Cover src={collection.coverUrl} alt={`Playlist ${collection.name}`} />
        <h3 className="card__title">{collection.name}</h3>
        <p className="card__subtitle">{cantidad === 1 ? '1 canción' : `${cantidad} canciones`}</p>
      </Link>
      {(onRename || onDelete) && (
        <div className="card__actions">
          {onRename && (
            <button type="button" className="link-button" onClick={() => onRename(collection)}>
              Renombrar
            </button>
          )}
          {onDelete && (
            <button type="button" className="link-button link-button--danger" onClick={() => onDelete(collection)}>
              Borrar
            </button>
          )}
        </div>
      )}
    </article>
  );
}
