// Tarjeta de artista: foto redonda y nombre. Lleva a /artist/:externalId (id de Deezer).
// Se usa en Search, Library y Home.
// Props: artist (Content del backend: { externalId, title, coverUrl }), actions
import { Link } from 'react-router-dom';
import Cover from './Cover';

export default function ArtistCard({ artist, actions }) {
  if (!artist) return null;

  return (
    <article className="card card--artist">
      <Link to={`/artist/${artist.externalId}`} className="card__link">
        <Cover src={artist.coverUrl} alt={`Foto de ${artist.title}`} round />
        <h3 className="card__title card__title--center">{artist.title}</h3>
      </Link>
      {actions}
    </article>
  );
}
