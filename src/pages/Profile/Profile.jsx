// Perfil del usuario: avatar, nombre, bio, géneros preferidos, favoritos y actividad reciente.
import { Link } from 'react-router-dom';
import * as usersService from '../../services/users.service';
import * as statsService from '../../services/stats.service';
import * as libraryService from '../../services/library.service';
import { useFetch } from '../../hooks/useFetch';
import { formatDate } from '../../utils/format';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import TrackCard from '../../components/cards/TrackCard';
import AlbumCard from '../../components/cards/AlbumCard';
import ArtistCard from '../../components/cards/ArtistCard';
import ActivityList from '../../components/activity/ActivityList';
import './Profile.css';

// El perfil es lo principal; actividad y favoritos son secundarios y no deben tirar la pantalla
async function pedirPerfil() {
  const [perfil, actividad, biblioteca] = await Promise.allSettled([
    usersService.getProfile(),
    statsService.getActivity(),
    libraryService.getLibrary(),
  ]);
  if (perfil.status === 'rejected') throw perfil.reason;
  return {
    user: perfil.value.user,
    preferences: perfil.value.preferences,
    activities: actividad.status === 'fulfilled' ? actividad.value.activities : [],
    favoritos: biblioteca.status === 'fulfilled' ? biblioteca.value.items.filter((i) => i.isFavorite) : [],
  };
}

export default function Profile() {
  const { data, loading, error, reload } = useFetch(pedirPerfil, []);

  if (loading) return <Spinner label="Cargando perfil..." />;

  if (error) {
    return (
      <section className="profile">
        <h1 className="page__title">Mi perfil</h1>
        <ErrorMessage message={error} onRetry={reload} />
      </section>
    );
  }

  const { user, preferences, activities, favoritos } = data;
  const nombre = user.displayName || user.username;

  return (
    <section className="profile">
      <header className="profile__header">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="" className="profile__avatar" />
        ) : (
          <span className="profile__avatar avatar--initial">{nombre.charAt(0).toUpperCase()}</span>
        )}
        <div>
          <h1 className="profile__name">{nombre}</h1>
          <p className="field__hint">
            @{user.username} · Se unió el {formatDate(user.createdAt)}
          </p>
          {user.bio ? <p className="profile__bio">{user.bio}</p> : <p className="field__hint">Todavía no escribiste tu bio.</p>}
          <Link to="/settings">Editar perfil</Link>
        </div>
      </header>

      <section className="profile__section">
        <h2 className="home__heading">Géneros preferidos</h2>
        {preferences.genres.length === 0 ? (
          <p className="field__hint">
            Todavía no elegiste géneros. <Link to="/settings">Elegilos en Configuración</Link>
          </p>
        ) : (
          <ul className="tag-list">
            {preferences.genres.map((g) => (
              <li key={g} className="tag">
                {g}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="profile__section">
        <h2 className="home__heading">Favoritos</h2>
        {favoritos.length === 0 ? (
          <EmptyState title="Sin favoritos todavía" message="Tocá el corazón en una canción, álbum o artista." />
        ) : (
          <div className="home__row">
            {favoritos.map((item) => {
              if (item.type === 'album') return <AlbumCard key={item.id} album={item} />;
              if (item.type === 'artist') return <ArtistCard key={item.id} artist={item} />;
              return <TrackCard key={item.id} track={item} />;
            })}
          </div>
        )}
      </section>

      <section className="profile__section">
        <h2 className="home__heading">Actividad reciente</h2>
        <ActivityList activities={activities} />
      </section>
    </section>
  );
}
