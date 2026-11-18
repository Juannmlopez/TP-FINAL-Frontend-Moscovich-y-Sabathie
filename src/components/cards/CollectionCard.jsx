// Tarjeta de playlist: portada, nombre y cantidad de canciones. Lleva a /collections/:id.
// Se usa en Collections y Home.
// Props: collection ({ id, name, coverUrl, itemCount }), onRename, onDelete
import { Link } from 'react-router-dom';

export default function CollectionCard({ collection, onRename, onDelete }) {
  if (!collection) return null;

  return (
    <article className="card card--collection">
      {/* TODO: portada (collection.coverUrl o mosaico de las primeras canciones) */}
      <Link to={`/collections/${collection.id}`}>{collection.name}</Link>
      {/* TODO: cantidad de canciones (collection.itemCount) */}
      {/* TODO: pasar estos botones a un menú de opciones según el Figma */}
      {onRename && (
        <button type="button" onClick={() => onRename(collection)}>
          Renombrar
        </button>
      )}
      {onDelete && (
        <button type="button" onClick={() => onDelete(collection)}>
          Borrar
        </button>
      )}
    </article>
  );
}
