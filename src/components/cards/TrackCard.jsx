// Tarjeta de canción: portada, título, artista y duración. Lleva a /track/:externalId (id de Deezer).
// Se usa en Home, Search, Library, Album y CollectionDetail.
// Props: track (Content del backend: { externalId, title, artistName, coverUrl, durationMs }),
//        size ('md' | 'lg'), actions (botones extra)
import { Link } from 'react-router-dom';
import Cover from './Cover';
import { formatDuration } from '../../utils/format';

export default function TrackCard({ track, size = 'md', actions }) {
  if (!track) return null;

  return (
    <article className={`card card--${size}`}>
      <Link to={`/track/${track.externalId}`} className="card__link">
        <Cover src={track.coverUrl} alt={`Portada de ${track.title}`} />
        <h3 className="card__title">{track.title}</h3>
        <p className="card__subtitle">
          {[track.artistName, formatDuration(track.durationMs)].filter(Boolean).join(' · ')}
        </p>
      </Link>
      {actions}
    </article>
  );
}
