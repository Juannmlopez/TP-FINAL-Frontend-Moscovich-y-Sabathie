// Pantalla de inicio: destacados de la API + resumen personal
// (favoritos, actividad reciente, progreso del objetivo anual y playlists).
//
// Servicios que va a usar:
//   - services/music.service.js: getFeatured
//   - services/stats.service.js: getHome
import { useState } from 'react';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import './Home.css';

export default function Home() {
  // Estados de la pantalla (los setters se agregan al implementar la carga)
  const [loading] = useState(false);
  const [error] = useState('');
  const [data] = useState(null);

  // TODO: useEffect que cargue los datos al montar, manejando loading y error

  if (loading) return <Spinner label="Cargando..." />;

  if (error) {
    return (
      <section className="home">
        <h1 className="page__title">Inicio</h1>
        <ErrorMessage message={error} />
      </section>
    );
  }

  if (!data) {
    return (
      <section className="home">
        <h1 className="page__title">Inicio</h1>
        <EmptyState title="Todavía no hay nada por acá" message="Buscá música y empezá a armar tu colección." />
      </section>
    );
  }

  return (
    <section className="home">
      <h1 className="page__title">Inicio</h1>
      {/* TODO: Sección "Destacados": lista de AlbumCard/TrackCard con musicService.getFeatured() */}
      {/* TODO: Sección "Tus favoritos": TrackCard/AlbumCard de los favoritos (statsService.getHome()) */}
      {/* TODO: Sección "Actividad reciente": últimas acciones del usuario */}
      {/* TODO: Sección "Progreso": minutos escuchados vs. objetivo anual (StatCard) */}
      {/* TODO: Sección "Tus playlists": CollectionCard de las últimas playlists */}
    </section>
  );
}
