// Estadísticas del usuario: 6 indicadores + rankings + resumen anual tipo Wrapped, con selector de año.
import { useState } from 'react';
import * as statsService from '../../services/stats.service';
import { useFetch } from '../../hooks/useFetch';
import { formatMinutes } from '../../utils/format';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import StatCard from '../../components/stats/StatCard';
import TopList from '../../components/stats/TopList';
import './Stats.css';

const ANIO_ACTUAL = new Date().getFullYear();
const ANIOS = Array.from({ length: 5 }, (_, i) => ANIO_ACTUAL - i);

export default function Stats() {
  const [year, setYear] = useState(ANIO_ACTUAL);
  const { data, loading, error, reload } = useFetch(() => statsService.getStats(year), [year]);

  const selector = (
    <label className="stats__year">
      Año
      <select className="status-select" value={year} onChange={(event) => setYear(Number(event.target.value))}>
        {ANIOS.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
    </label>
  );

  let contenido;
  if (loading) {
    contenido = <Spinner label="Calculando estadísticas..." />;
  } else if (error) {
    contenido = <ErrorMessage message={error} onRetry={reload} />;
  } else if (!data || (data.plays === 0 && data.library.total === 0)) {
    contenido = <EmptyState title="Todavía no hay estadísticas" message={`Escuchá música para ver tu resumen de ${year}.`} />;
  } else {
    const topArtista = data.topArtists[0];
    const topCancion = data.topTracks[0];
    const topGenero = data.genres[0];
    const topMomento = data.timeOfDay[0];
    const maxMomento = Math.max(1, ...data.timeOfDay.map((m) => m.plays));

    contenido = (
      <>
        {data.plays > 0 && (
          <section className="wrapped" aria-label={`Tu ${year} en resumen`}>
            <p className="home__eyebrow">#MYCOLLECTIONWRAPPED</p>
            <h2 className="wrapped__title">Tu {year} en resumen</h2>
            <p className="wrapped__big">{formatMinutes(data.minutesListened)}</p>
            <p>de música en {data.plays} reproducciones</p>
            <ul className="wrapped__facts">
              {topArtista && (
                <li>
                  Tu artista del año: <strong>{topArtista.name}</strong>
                </li>
              )}
              {topCancion && (
                <li>
                  Tu canción más escuchada: <strong>{topCancion.title}</strong>
                </li>
              )}
              {topGenero && (
                <li>
                  Tu género favorito: <strong>{topGenero.name}</strong>
                </li>
              )}
              {topMomento && (
                <li>
                  Escuchás más a la <strong>{topMomento.moment.toLowerCase()}</strong>
                </li>
              )}
            </ul>
          </section>
        )}

        <div className="stats__grid">
          <StatCard label="Minutos escuchados" value={formatMinutes(data.minutesListened)} hint={`en ${year}`} />
          <StatCard label="Reproducciones" value={data.plays.toLocaleString('es-AR')} />
          <StatCard label="Canciones distintas" value={data.uniqueTracks.toLocaleString('es-AR')} />
          <StatCard label="En tu biblioteca" value={data.library.total} hint={`${data.library.favorites} favoritos`} />
          <StatCard label="Escuchados" value={data.library.escuchado} hint={`${data.library.escuchando} escuchando ahora`} />
          <StatCard label="Quiero escuchar" value={data.library.quieroEscuchar} />
        </div>

        <div className="stats__rankings">
          <TopList
            title="Top artistas"
            items={data.topArtists.map((a) => ({ name: a.name, value: a.minutes }))}
            renderValue={formatMinutes}
          />
          <TopList
            title="Top canciones"
            items={data.topTracks.map((t) => ({
              id: t.id,
              name: t.title,
              subtitle: t.artistName,
              coverUrl: t.coverUrl,
              value: t.plays,
            }))}
            renderValue={(v) => `${v} ${v === 1 ? 'vez' : 'veces'}`}
          />
          <TopList
            title="Géneros que predominan"
            items={data.genres.slice(0, 5).map((g) => ({ name: g.name, value: g.minutes }))}
            renderValue={formatMinutes}
          />
        </div>

        <section className="top-list">
          <h3 className="top-list__title">Cuándo escuchás</h3>
          {data.timeOfDay.length === 0 ? (
            <p className="field__hint">Todavía no hay datos.</p>
          ) : (
            <ul className="bars">
              {data.timeOfDay.map((m) => (
                <li key={m.moment} className="bars__item">
                  <span className="bars__label">{m.moment}</span>
                  <span className="bars__track">
                    <span className="bars__fill" style={{ width: `${(m.plays / maxMomento) * 100}%` }} />
                  </span>
                  <span className="field__hint">{m.plays}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </>
    );
  }

  return (
    <section className="stats">
      <header className="page__header">
        <h1 className="page__title">Estadísticas</h1>
        {selector}
      </header>
      {contenido}
    </section>
  );
}
