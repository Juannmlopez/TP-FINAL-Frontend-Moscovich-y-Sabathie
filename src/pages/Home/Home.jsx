// Pantalla Home (Figma): "Escuchado recientemente", "Tu año en resumen" y destacados de Deezer.
//
// Servicios:
//   - services/music.service.js: getFeatured → { tracks, albums } (chart de Deezer)
//   - services/stats.service.js: getActivity → { activities } (para "Escuchado recientemente")
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as musicService from '../../services/music.service';
import * as statsService from '../../services/stats.service';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import AlbumCard from '../../components/cards/AlbumCard';
import TrackCard from '../../components/cards/TrackCard';
import Cover from '../../components/cards/Cover';
import './Home.css';

const MAX_RECIENTES = 10;
const ANIO = new Date().getFullYear(); // año para "Tu año en resumen"

// De la actividad, se queda con los contenidos (sin repetir) en orden de más nuevo a más viejo
function contenidosRecientes(activities = []) {
  const vistos = new Set();
  const recientes = [];
  for (const actividad of activities) {
    const contenido = actividad.content;
    if (!contenido || vistos.has(contenido.id)) continue;
    vistos.add(contenido.id);
    recientes.push(contenido);
    if (recientes.length === MAX_RECIENTES) break;
  }
  return recientes;
}

// Pide destacados y actividad en paralelo. La actividad es secundaria: si falla,
// la Home se muestra igual sin "Escuchado recientemente".
async function pedirDatos() {
  const [featured, actividad] = await Promise.allSettled([
    musicService.getFeatured(),
    statsService.getActivity(),
  ]);
  return { featured, actividad };
}

// Fila con scroll horizontal y título de sección
function Fila({ titulo, children }) {
  return (
    <section className="home__section">
      <h2 className="home__heading">{titulo}</h2>
      <div className="home__row">{children}</div>
    </section>
  );
}

// Ítem chico de "Escuchado recientemente". Si el backend manda type y externalId, lleva al detalle.
function Reciente({ contenido }) {
  const ruta =
    contenido.externalId && (contenido.type === 'album' || contenido.type === 'track')
      ? `/${contenido.type}/${contenido.externalId}`
      : null;
  const cuerpo = (
    <>
      <Cover src={contenido.coverUrl} alt={`Portada de ${contenido.title}`} />
      <p className="home__recent-title">{contenido.title}</p>
      {contenido.artistName && <p className="card__subtitle">{contenido.artistName}</p>}
    </>
  );

  return (
    <article className="home__recent">
      {ruta ? (
        <Link to={ruta} className="card__link">
          {cuerpo}
        </Link>
      ) : (
        cuerpo
      )}
    </article>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [destacados, setDestacados] = useState({ tracks: [], albums: [] });
  const [recientes, setRecientes] = useState([]);

  // Aplica al estado lo que devolvió pedirDatos()
  const aplicar = useCallback(({ featured, actividad }) => {
    if (featured.status === 'fulfilled') {
      setDestacados({ tracks: featured.value.tracks || [], albums: featured.value.albums || [] });
    } else {
      setError(featured.reason.message);
    }
    setRecientes(actividad.status === 'fulfilled' ? contenidosRecientes(actividad.value.activities) : []);
    setLoading(false);
  }, []);

  // Carga inicial. "cancelado" evita actualizar el estado si se sale de la pantalla antes de que responda
  useEffect(() => {
    let cancelado = false;
    pedirDatos().then((datos) => {
      if (!cancelado) aplicar(datos);
    });
    return () => {
      cancelado = true;
    };
  }, [aplicar]);

  // Botón "Reintentar" del error: vuelve a mostrar el spinner y pide todo de nuevo
  function reintentar() {
    setLoading(true);
    setError('');
    pedirDatos().then(aplicar);
  }

  if (loading) return <Spinner label="Cargando..." />;

  return (
    <div className="home">
      <h1 className="sr-only">Inicio</h1>

      {recientes.length > 0 && (
        <Fila titulo="Escuchado recientemente">
          {recientes.map((contenido) => (
            <Reciente key={contenido.id} contenido={contenido} />
          ))}
        </Fila>
      )}

      <section className="home__section">
        <div className="home__wrapped-header">
          <span className="home__wrapped-badge" aria-hidden="true">
            {String(ANIO).slice(2)}
          </span>
          <div>
            <p className="home__eyebrow">#MYCOLLECTIONWRAPPED</p>
            <h2 className="home__heading home__heading--flush">Tu {ANIO} en resumen</h2>
          </div>
        </div>
        <div className="home__row">
          <Link to="/stats" className="home__wrapped-card home__wrapped-card--songs">
            <span className="home__wrapped-art">
              Tus canciones
              <br />
              <strong>{ANIO}</strong>
            </span>
            <span className="home__wrapped-label">Tus canciones más escuchadas</span>
          </Link>
          <Link to="/stats" className="home__wrapped-card home__wrapped-card--artists">
            <span className="home__wrapped-art">
              Tus artistas
              <br />
              <strong>del año</strong>
            </span>
            <span className="home__wrapped-label">Tus artistas del año</span>
          </Link>
        </div>
      </section>

      {error ? (
        <section className="home__section">
          <h2 className="home__heading">Destacados</h2>
          <ErrorMessage message={error} onRetry={reintentar} />
        </section>
      ) : (
        <>
          <Fila titulo="Destacados">
            {destacados.albums.map((album) => (
              <AlbumCard key={album.id} album={album} size="lg" />
            ))}
          </Fila>
          <Fila titulo="Canciones del momento">
            {destacados.tracks.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </Fila>
        </>
      )}
    </div>
  );
}
