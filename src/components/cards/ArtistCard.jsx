// Tarjeta de artista: imagen redonda y nombre. Lleva a /artist/:id.
// Se usa en Search, Library y Home.
// Props: artist ({ id, title, coverUrl }), actions
import { Link } from 'react-router-dom';

export default function ArtistCard({ artist, actions }) {
  if (!artist) return null;

  return (
    <article className="card card--artist">
      {/* TODO: imagen del artista (artist.coverUrl) en formato circular */}
      <Link to={`/artist/${artist.id}`}>{artist.title}</Link>
      {/* TODO: géneros principales */}
      {actions}
    </article>
  );
}
