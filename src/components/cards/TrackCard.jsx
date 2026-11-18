// Tarjeta de canción: portada, título, artista y duración. Lleva a /track/:id.
// Se usa en Home, Search, Library, Album y CollectionDetail.
// Props: track ({ id, title, artistName, coverUrl, durationMs }), actions (botones extra)
import { Link } from 'react-router-dom';

export default function TrackCard({ track, actions }) {
  if (!track) return null;

  return (
    <article className="card card--track">
      {/* TODO: portada (track.coverUrl) con imagen por defecto si no hay */}
      <Link to={`/track/${track.id}`}>{track.title}</Link>
      {/* TODO: artista (track.artistName) y duración con formatDuration(track.durationMs) */}
      {actions}
    </article>
  );
}
