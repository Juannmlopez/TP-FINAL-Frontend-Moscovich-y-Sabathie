// Configuración: editar datos del perfil (nombre, bio, avatar) y preferencias
// (tema, idioma, contenido explícito, perfil público, objetivo anual, géneros).
//
// Servicios que va a usar:
//   - services/users.service.js: getProfile, updateProfile, updatePreferences
import { useState } from 'react';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import './Settings.css';

export default function Settings() {
  // Estados de la pantalla (los setters se agregan al implementar la carga)
  const [loading] = useState(false);
  const [error] = useState('');
  const [data] = useState(null);

  // TODO: useEffect que cargue los datos al montar, manejando loading y error

  if (loading) return <Spinner label="Cargando..." />;

  if (error) {
    return (
      <section className="settings">
        <h1 className="page__title">Configuración</h1>
        <ErrorMessage message={error} />
      </section>
    );
  }

  if (!data) {
    return (
      <section className="settings">
        <h1 className="page__title">Configuración</h1>
        <EmptyState title="No pudimos cargar tus datos" />
      </section>
    );
  }

  return (
    <section className="settings">
      <h1 className="page__title">Configuración</h1>
      {/* TODO: Formulario de perfil: displayName, bio, avatarUrl (usersService.updateProfile) */}
      {/* TODO: Formulario de preferencias: theme, language, showExplicit, profilePublic, yearlyGoal y */}
      {/*   géneros preferidos (usersService.updatePreferences) */}
      {/* TODO: Mostrar mensaje de éxito / ErrorMessage al guardar */}
    </section>
  );
}
