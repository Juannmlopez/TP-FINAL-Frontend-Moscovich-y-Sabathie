// Biblioteca del usuario. /library muestra el resumen por categorías y todo el contenido;
// /library/:categoria es el detalle de una categoría (canciones, álbumes, artistas, favoritos o un estado).
// Filtros: categoría, estado, favoritos y texto. Orden: recientes, título, artista o puntuación.
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as libraryService from '../../services/library.service';
import { useFetch } from '../../hooks/useFetch';
import { usePlayer } from '../../hooks/usePlayer';
import { STATUSES } from '../../utils/constants';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import TrackCard from '../../components/cards/TrackCard';
import AlbumCard from '../../components/cards/AlbumCard';
import ArtistCard from '../../components/cards/ArtistCard';
import StatusSelect from '../../components/library/StatusSelect';
import FavoriteButton from '../../components/library/FavoriteButton';
import './Library.css';

// Categorías de /library/:categoria → función que dice si un ítem pertenece
const CATEGORIAS = {
  todo: { label: 'Todo', filtro: () => true },
  canciones: { label: 'Canciones', filtro: (i) => i.type === 'track' },
  albumes: { label: 'Álbumes', filtro: (i) => i.type === 'album' },
  artistas: { label: 'Artistas', filtro: (i) => i.type === 'artist' },
  favoritos: { label: 'Favoritos', filtro: (i) => i.isFavorite },
  ...Object.fromEntries(STATUSES.map((s) => [s.value, { label: s.label, filtro: (i) => i.status === s.value }])),
};

const ORDENES = {
  recientes: { label: 'Agregado recientemente', fn: (a, b) => new Date(b.addedAt) - new Date(a.addedAt) },
  titulo: { label: 'Título (A-Z)', fn: (a, b) => a.title.localeCompare(b.title, 'es') },
  artista: { label: 'Artista (A-Z)', fn: (a, b) => (a.artistName || '').localeCompare(b.artistName || '', 'es') },
  puntuacion: { label: 'Mejor puntuados', fn: (a, b) => (b.rating ?? 0) - (a.rating ?? 0) },
};

export default function Library() {
  const { categoria = 'todo' } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, reload, setData } = useFetch(() => libraryService.getLibrary(), []);
  const { playList } = usePlayer();

  const [estado, setEstado] = useState('');
  const [soloFavoritos, setSoloFavoritos] = useState(false);
  const [texto, setTexto] = useState('');
  const [orden, setOrden] = useState('recientes');
  const [errorAccion, setErrorAccion] = useState('');

  const items = useMemo(() => data?.items || [], [data]);
  const cat = CATEGORIAS[categoria];

  const visibles = useMemo(() => {
    if (!cat) return [];
    const q = texto.trim().toLowerCase();
    return items
      .filter(cat.filtro)
      .filter((i) => !estado || i.status === estado)
      .filter((i) => !soloFavoritos || i.isFavorite)
      .filter((i) => !q || `${i.title} ${i.artistName || ''}`.toLowerCase().includes(q))
      .sort(ORDENES[orden].fn);
  }, [items, cat, estado, soloFavoritos, texto, orden]);

  const tracksVisibles = visibles.filter((i) => i.type === 'track');

  function reemplazar(actualizado) {
    setData({ items: items.map((i) => (i.id === actualizado.id ? { ...i, ...actualizado } : i)) });
  }

  async function cambiar(item, cambios) {
    setErrorAccion('');
    try {
      reemplazar(await libraryService.updateItem(item.id, cambios));
    } catch (err) {
      setErrorAccion(err.message);
    }
  }

  async function quitar(item) {
    setErrorAccion('');
    try {
      await libraryService.removeItem(item.id);
      setData({ items: items.filter((i) => i.id !== item.id) });
    } catch (err) {
      setErrorAccion(err.message);
    }
  }

  if (loading) return <Spinner label="Cargando biblioteca..." />;

  if (error) {
    return (
      <section className="library">
        <h1 className="page__title">Mi biblioteca</h1>
        <ErrorMessage message={error} onRetry={reload} />
      </section>
    );
  }

  if (!cat) {
    return (
      <section className="library">
        <h1 className="page__title">Mi biblioteca</h1>
        <EmptyState
          title="Esa categoría no existe"
          action={<Link to="/library">Volver a la biblioteca</Link>}
        />
      </section>
    );
  }

  return (
    <section className="library">
      <h1 className="page__title">{categoria === 'todo' ? 'Mi biblioteca' : cat.label}</h1>
      {categoria !== 'todo' && (
        <p>
          <Link to="/library">‹ Toda la biblioteca</Link>
        </p>
      )}

      {/* Resumen: cada categoría con su cantidad */}
      <nav className="library__categories" aria-label="Categorías">
        {Object.entries(CATEGORIAS).map(([clave, c]) => (
          <button
            key={clave}
            type="button"
            className={`search__chip ${clave === categoria ? 'search__chip--active' : ''}`}
            aria-pressed={clave === categoria}
            onClick={() => navigate(clave === 'todo' ? '/library' : `/library/${clave}`)}
          >
            {c.label} <span className="library__count">{items.filter(c.filtro).length}</span>
          </button>
        ))}
      </nav>

      {items.length === 0 ? (
        <EmptyState
          title="Tu biblioteca está vacía"
          message="Guardá canciones, álbumes o artistas desde la búsqueda."
          action={<Link to="/search">Ir a buscar</Link>}
        />
      ) : (
        <>
          <div className="library__filters">
            <input
              type="search"
              className="field__input"
              placeholder="Filtrar por título o artista"
              aria-label="Filtrar por título o artista"
              value={texto}
              onChange={(event) => setTexto(event.target.value)}
            />
            <select
              className="status-select"
              value={estado}
              onChange={(event) => setEstado(event.target.value)}
              aria-label="Filtrar por estado"
            >
              <option value="">Todos los estados</option>
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <select
              className="status-select"
              value={orden}
              onChange={(event) => setOrden(event.target.value)}
              aria-label="Ordenar por"
            >
              {Object.entries(ORDENES).map(([clave, o]) => (
                <option key={clave} value={clave}>
                  {o.label}
                </option>
              ))}
            </select>
            <label className="library__check">
              <input type="checkbox" checked={soloFavoritos} onChange={(event) => setSoloFavoritos(event.target.checked)} />
              Solo favoritos
            </label>
          </div>

          <ErrorMessage message={errorAccion} />

          {tracksVisibles.length > 0 && (
            <Button variant="secondary" onClick={() => playList(tracksVisibles, 0)}>
              Reproducir canciones ({tracksVisibles.length})
            </Button>
          )}

          {visibles.length === 0 ? (
            <EmptyState title="Sin resultados" message="Probá con otros filtros." />
          ) : (
            <p className="field__hint" aria-live="polite">
              {visibles.length} {visibles.length === 1 ? 'resultado' : 'resultados'}
            </p>
          )}

          <div className="card-grid">
            {visibles.map((item) => {
              const acciones = (
                <div className="library__item-actions">
                  <StatusSelect value={item.status} onChange={(status) => cambiar(item, { status })} />
                  <FavoriteButton active={item.isFavorite} onToggle={(isFavorite) => cambiar(item, { isFavorite })} />
                  <button type="button" className="link-button link-button--danger" onClick={() => quitar(item)}>
                    Quitar
                  </button>
                </div>
              );
              if (item.type === 'album') return <AlbumCard key={item.id} album={item} actions={acciones} />;
              if (item.type === 'artist') return <ArtistCard key={item.id} artist={item} actions={acciones} />;
              return <TrackCard key={item.id} track={item} actions={acciones} />;
            })}
          </div>
        </>
      )}
    </section>
  );
}
