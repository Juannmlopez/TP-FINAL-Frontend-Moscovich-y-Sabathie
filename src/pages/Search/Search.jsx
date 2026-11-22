// Pantalla Búsqueda (Figma): barra de búsqueda + "Cancelar", filtro Canciones/Álbumes,
// resultados de Deezer en lista y "Búsquedas recientes" cuando no hay texto.
//
// El texto y el tipo viven en la URL (?q=&type=), así el botón "atrás" y recargar mantienen la búsqueda.
// Servicio: services/music.service.js → search({ q, type }) → { results: Content[] }
// Las playlists no vienen de Deezer: se buscan por nombre entre las del usuario (collections.service.js).
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as musicService from '../../services/music.service';
import * as collectionsService from '../../services/collections.service';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import Cover from '../../components/cards/Cover';
import './Search.css';

const TIPOS = [
  { value: 'track', label: 'Canciones' },
  { value: 'album', label: 'Álbumes' },
  { value: 'artist', label: 'Artistas' },
  { value: 'playlist', label: 'Playlists' },
];
const ETIQUETA_TIPO = { track: 'Canción', album: 'Álbum', artist: 'Artista', playlist: 'Playlist' };
const ORDENES = {
  relevancia: { label: 'Relevancia', fn: null },
  titulo: { label: 'Título (A-Z)', fn: (a, b) => a.title.localeCompare(b.title, 'es') },
  artista: { label: 'Artista (A-Z)', fn: (a, b) => (a.artistName || '').localeCompare(b.artistName || '', 'es') },
};

// Ruta del detalle de un resultado
function rutaDe(contenido) {
  return contenido.type === 'playlist' ? `/collections/${contenido.id}` : `/${contenido.type}/${contenido.externalId}`;
}

// Busca según el tipo: Deezer para canciones, álbumes y artistas; las playlists del usuario por nombre
async function buscar(q, type) {
  if (type !== 'playlist') return (await musicService.search({ q, type })).results || [];
  const { collections } = await collectionsService.getCollections();
  const texto = q.toLowerCase();
  return collections
    .filter((c) => c.name.toLowerCase().includes(texto))
    .map((c) => ({
      id: `playlist-${c.id}`,
      ...c,
      type: 'playlist',
      title: c.name,
      artistName: `${c.itemCount} ${c.itemCount === 1 ? 'canción' : 'canciones'}`,
    }));
}
const ESPERA_MS = 400; // espera después de la última tecla antes de buscar
const MAX_TEXTO = 100; // límite del backend
const CLAVE_RECIENTES = 'busquedasRecientes';
const MAX_RECIENTES = 10;

// Búsquedas recientes: se guardan en el navegador los resultados que el usuario abrió
function leerRecientes() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_RECIENTES)) || [];
  } catch {
    return [];
  }
}

function guardarRecientes(lista) {
  localStorage.setItem(CLAVE_RECIENTES, JSON.stringify(lista));
}

// Fila de resultado: portada, título y "Tipo • Artista". Lleva al detalle con el id de Deezer.
function FilaResultado({ contenido, onAbrir, onQuitar }) {
  return (
    <li className="search__item">
      <Link
        to={rutaDe(contenido)}
        className="search__link"
        onClick={() => onAbrir?.(contenido)}
      >
        <span className="search__cover">
          <Cover src={contenido.coverUrl} alt="" />
        </span>
        <span className="search__text">
          <span className="search__title">{contenido.title}</span>
          <span className="search__subtitle">
            {contenido.explicit && (
              <span className="search__explicit" title="Explícito">
                E
              </span>
            )}
            {[ETIQUETA_TIPO[contenido.type], contenido.artistName].filter(Boolean).join(' • ')}
          </span>
        </span>
      </Link>
      {onQuitar && (
        <button
          type="button"
          className="search__remove"
          onClick={() => onQuitar(contenido)}
          aria-label={`Quitar ${contenido.title} de búsquedas recientes`}
        >
          ×
        </button>
      )}
    </li>
  );
}

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = (searchParams.get('q') || '').trim();
  const typeParam = searchParams.get('type');
  const type = TIPOS.some((t) => t.value === typeParam) ? typeParam : 'track';
  const [orden, setOrden] = useState('relevancia');
  const clave = `${type}:${q}`; // identifica la búsqueda actual

  const [texto, setTexto] = useState(searchParams.get('q') || '');
  // Resultado de la última búsqueda que respondió, con la clave a la que corresponde
  const [resultado, setResultado] = useState({ clave: '', items: [], error: '' });
  const [intento, setIntento] = useState(0); // sube al tocar "Reintentar"
  const [recientes, setRecientes] = useState(leerRecientes);

  // Mientras la respuesta no corresponda a la búsqueda actual, estamos cargando
  const cargando = q !== '' && resultado.clave !== clave;

  // Pasa lo que se escribe a la URL después de una pausa (no busca en cada tecla)
  useEffect(() => {
    const limpio = texto.trim();
    if (limpio === q) return;
    const timer = setTimeout(() => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (limpio) next.set('q', limpio);
          else next.delete('q');
          return next;
        },
        { replace: true }
      );
    }, ESPERA_MS);
    return () => clearTimeout(timer);
  }, [texto, q, setSearchParams]);

  // Busca cada vez que cambia la búsqueda de la URL
  useEffect(() => {
    if (!q) return;
    let cancelado = false;
    buscar(q, type)
      .then((items) => {
        if (!cancelado) setResultado({ clave, items, error: '' });
      })
      .catch((error) => {
        if (!cancelado) setResultado({ clave, items: [], error: error.message });
      });
    return () => {
      cancelado = true;
    };
  }, [q, type, clave, intento]);

  function cambiarTipo(nuevo) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('type', nuevo);
        return next;
      },
      { replace: true }
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    // Enter busca ya, sin esperar la pausa
    const limpio = texto.trim();
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (limpio) next.set('q', limpio);
      else next.delete('q');
      return next;
    });
  }

  function cancelar() {
    setTexto('');
    setSearchParams({ type }, { replace: true });
  }

  function reintentar() {
    setResultado({ clave: '', items: [], error: '' });
    setIntento((n) => n + 1);
  }

  function agregarReciente(contenido) {
    const lista = [contenido, ...recientes.filter((r) => r.id !== contenido.id)].slice(0, MAX_RECIENTES);
    setRecientes(lista);
    guardarRecientes(lista);
  }

  function quitarReciente(contenido) {
    const lista = recientes.filter((r) => r.id !== contenido.id);
    setRecientes(lista);
    guardarRecientes(lista);
  }

  function borrarRecientes() {
    setRecientes([]);
    guardarRecientes([]);
  }

  const ordenFn = ORDENES[orden].fn;
  const itemsOrdenados = ordenFn ? [...resultado.items].sort(ordenFn) : resultado.items;

  let contenido;
  if (!q) {
    contenido =
      recientes.length > 0 ? (
        <section className="search__section">
          <div className="search__section-header">
            <h2 className="search__heading">Búsquedas recientes</h2>
            <button type="button" className="search__clear" onClick={borrarRecientes}>
              Borrar todo
            </button>
          </div>
          <ul className="search__list">
            {recientes.map((item) => (
              <FilaResultado key={item.id} contenido={item} onAbrir={agregarReciente} onQuitar={quitarReciente} />
            ))}
          </ul>
        </section>
      ) : (
        <EmptyState title="Buscá tu música" message="Encontrá canciones, álbumes, artistas y playlists." />
      );
  } else if (cargando) {
    contenido = <Spinner label="Buscando..." />;
  } else if (resultado.error) {
    contenido = <ErrorMessage message={resultado.error} onRetry={reintentar} />;
  } else if (resultado.items.length === 0) {
    contenido = <EmptyState title="Sin resultados" message={`No encontramos nada para "${q}". Probá con otra búsqueda o cambiá el filtro.`} />;
  } else {
    contenido = (
      <ul className="search__list">
        {itemsOrdenados.map((item) => (
          <FilaResultado key={item.id} contenido={item} onAbrir={agregarReciente} />
        ))}
      </ul>
    );
  }

  return (
    <section className="search">
      <h1 className="sr-only">Buscar</h1>

      <form className="search__bar" role="search" onSubmit={handleSubmit}>
        <label className="search__field">
          <span className="search__icon" aria-hidden="true">
            ⌕
          </span>
          <span className="sr-only">Buscar canciones, álbumes, artistas o playlists</span>
          <input
            type="search"
            className="search__input"
            placeholder="¿Qué querés escuchar?"
            value={texto}
            maxLength={MAX_TEXTO}
            onChange={(event) => setTexto(event.target.value)}
            autoFocus
            enterKeyHint="search"
          />
        </label>
        {texto && (
          <button type="button" className="search__cancel" onClick={cancelar}>
            Cancelar
          </button>
        )}
      </form>

      <div className="search__filters" role="group" aria-label="Tipo de resultado">
        {TIPOS.map((tipo) => (
          <button
            key={tipo.value}
            type="button"
            className={`search__chip ${type === tipo.value ? 'search__chip--active' : ''}`}
            aria-pressed={type === tipo.value}
            onClick={() => cambiarTipo(tipo.value)}
          >
            {tipo.label}
          </button>
        ))}
        {q && type !== 'playlist' && type !== 'artist' && (
          <select
            className="status-select search__sort"
            value={orden}
            onChange={(event) => setOrden(event.target.value)}
            aria-label="Ordenar resultados"
          >
            {Object.entries(ORDENES).map(([clave, o]) => (
              <option key={clave} value={clave}>
                {o.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {contenido}
    </section>
  );
}
