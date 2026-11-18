// Tarjeta de álbum: portada, título, artista y año. Lleva a /album/:id.
// Se usa en Home, Search, Library y Artist (discografía).
// Props: album ({ id, title, artistName, coverUrl, releaseDate }), actions
import { Link } from 'react-router-dom';

export default function AlbumCard({ album, actions }) {
  if (!album) return null;

  return (
    <article className="card card--album">
      {/* TODO: portada (album.coverUrl) */}
      <Link to={`/album/${album.id}`}>{album.title}</Link>
      {/* TODO: artista y año de lanzamiento (album.releaseDate) */}
      {actions}
    </article>
  );
}
