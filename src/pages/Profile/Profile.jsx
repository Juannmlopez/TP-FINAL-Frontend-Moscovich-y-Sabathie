// Perfil del usuario: avatar, nombre, bio, géneros preferidos, favoritos y
// actividad reciente.
//
// Servicios que va a usar:
//   - services/users.service.js: getProfile
//   - services/stats.service.js: getActivity
import { useState } from 'react';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import './Profile.css';

export default function Profile() {
  // Estados de la pantalla (los setters se agregan al implementar la carga)
  const [loading] = useState(false);
  const [error] = useState('');
  const [data] = useState(null);

  // TODO: useEffect que cargue los datos al montar, manejando loading y error

  if (loading) return <Spinner label="Cargando..." />;

  if (error) {
    return (
      <section className="profile">
        <h1 className="page__title">Mi perfil</h1>
        <ErrorMessage message={error} />
      </section>
    );
  }

  if (!data) {
    return (
      <section className="profile">
        <h1 className="page__title">Mi perfil</h1>
        <EmptyState title="Sin actividad todavía" />
      </section>
    );
  }

  return (
    <section className="profile">
      <h1 className="page__title">Mi perfil</h1>
      {/* TODO: Cabecera: avatar, nombre, @username y bio (usersService.getProfile()) */}
      {/* TODO: Géneros preferidos como etiquetas */}
      {/* TODO: Favoritos: TrackCard / AlbumCard */}
      {/* TODO: Actividad reciente (statsService.getActivity()) con formatDate */}
    </section>
  );
}
