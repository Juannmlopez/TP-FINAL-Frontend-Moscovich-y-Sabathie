// Tarjeta de álbum: portada, título, artista y año. Lleva a /album/:externalId (id de Deezer).
// Se usa en Home, Search, Library y Artist (discografía).
// Props: album (Content del backend: { externalId, title, artistName, coverUrl, releaseDate }),
//        size ('md' | 'lg'), actions (botones extra)
import { Link } from 'react-router-dom';
import Cover from './Cover';

export default function AlbumCard({ album, size = 'md', actions }) {
  if (!album) return null;
  const anio = album.releaseDate ? album.releaseDate.slice(0, 4) : '';

  return (
    <article className={`card card--${size}`}>
      <Link to={`/album/${album.externalId}`} className="card__link">
        <Cover src={album.coverUrl} alt={`Portada de ${album.title}`} />
        <h3 className="card__title">{album.title}</h3>
        <p className="card__subtitle">{[album.artistName, anio].filter(Boolean).join(' · ')}</p>
      </Link>
      {actions}
    </article>
  );
}
