// Estadísticas del usuario: mínimo 6 indicadores calculados por el backend
// (minutos escuchados, top artistas, top canciones, géneros, etc.) + resumen anual
// tipo Wrapped con selector de año.
//
// Servicios que va a usar:
//   - services/stats.service.js: getStats
import { useState } from 'react';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import './Stats.css';

export default function Stats() {
  // Estados de la pantalla (los setters se agregan al implementar la carga)
  const [loading] = useState(false);
  const [error] = useState('');
  const [data] = useState(null);

  // TODO: useEffect que cargue los datos al montar, manejando loading y error

  if (loading) return <Spinner label="Cargando..." />;

  if (error) {
    return (
      <section className="stats">
        <h1 className="page__title">Estadísticas</h1>
        <ErrorMessage message={error} />
      </section>
    );
  }

  if (!data) {
    return (
      <section className="stats">
        <h1 className="page__title">Estadísticas</h1>
        <EmptyState title="Todavía no hay estadísticas" message="Escuchá música para ver tu resumen." />
      </section>
    );
  }

  return (
    <section className="stats">
      <h1 className="page__title">Estadísticas</h1>
      {/* TODO: Selector de año y carga con statsService.getStats(year) */}
      {/* TODO: Indicadores: StatCard (minutos con formatMinutes, cantidad de canciones, etc.) */}
      {/* TODO: Rankings: TopList de artistas, canciones y géneros */}
      {/* TODO: Resumen anual tipo Wrapped */}
    </section>
  );
}
