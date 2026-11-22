// Configuración: perfil (nombre, bio, avatar), preferencias (tema, idioma, géneros) y
// ajustes de reproducción, notificaciones y privacidad.
// Todo se guarda en el backend: perfil (/users/me) y preferencias + ajustes (/users/me/preferences).
import { useState } from 'react';
import * as usersService from '../../services/users.service';
import { useAuth } from '../../hooks/useAuth';
import { settingsFrom } from '../../utils/localSettings';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useFetch } from '../../hooks/useFetch';
import './Settings.css';

const URL_REGEX = /^https?:\/\/\S+$/;

// Casilla con texto
function Check({ label, checked, onChange }) {
  return (
    <label className="library__check settings__check">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}

// Resultado de guardar una sección
function Resultado({ ok, error }) {
  if (error) return <ErrorMessage message={error} />;
  if (ok) {
    return (
      <p className="notice notice--success" role="status">
        {ok}
      </p>
    );
  }
  return null;
}

function PerfilForm({ user, onSaved }) {
  const [form, setForm] = useState({
    displayName: user.displayName || '',
    bio: user.bio || '',
    avatarUrl: user.avatarUrl || '',
  });
  const [errores, setErrores] = useState({});
  const [estado, setEstado] = useState({ ok: '', error: '' });
  const [guardando, setGuardando] = useState(false);

  function cambiar(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: undefined }));
  }

  async function guardar(event) {
    event.preventDefault();
    const nuevos = {};
    const nombre = form.displayName.trim();
    if (nombre.length < 1 || nombre.length > 60) nuevos.displayName = 'El nombre debe tener entre 1 y 60 caracteres';
    if (form.bio.length > 300) nuevos.bio = 'La bio no puede superar los 300 caracteres';
    if (form.avatarUrl.trim() && !URL_REGEX.test(form.avatarUrl.trim())) nuevos.avatarUrl = 'Tiene que ser una URL que empiece con http:// o https://';
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    setGuardando(true);
    setEstado({ ok: '', error: '' });
    try {
      // La bio puede quedar vacía; el avatar solo se manda si hay una URL (el backend no acepta vacío)
      const body = { displayName: nombre, bio: form.bio.trim() };
      if (form.avatarUrl.trim()) body.avatarUrl = form.avatarUrl.trim();
      const actualizado = await usersService.updateProfile(body);
      onSaved(actualizado.user || actualizado);
      setEstado({ ok: 'Perfil actualizado', error: '' });
    } catch (err) {
      setEstado({ ok: '', error: err.message });
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form className="settings__section form-stack" onSubmit={guardar} noValidate>
      <h2 className="home__heading">Perfil</h2>
      <Input label="Nombre para mostrar" name="displayName" value={form.displayName} onChange={cambiar} error={errores.displayName} maxLength={60} />
      <div className="field">
        <label className="field__label" htmlFor="bio">
          Bio
        </label>
        <textarea id="bio" name="bio" rows={3} maxLength={300} className="field__input" value={form.bio} onChange={cambiar} />
        <p className={errores.bio ? 'field__error' : 'field__hint'}>{errores.bio || `${form.bio.length} / 300`}</p>
      </div>
      <Input
        label="URL del avatar"
        name="avatarUrl"
        type="url"
        value={form.avatarUrl}
        onChange={cambiar}
        error={errores.avatarUrl}
        hint="Link a una imagen (opcional)"
      />
      <Resultado {...estado} />
      <Button type="submit" loading={guardando}>
        Guardar perfil
      </Button>
    </form>
  );
}

function PreferenciasForm({ preferences, onSaved }) {
  const [theme, setTheme] = useState(preferences.theme);
  const [language, setLanguage] = useState(preferences.language);
  const [genres, setGenres] = useState(preferences.genres);
  const [nuevoGenero, setNuevoGenero] = useState('');
  const [estado, setEstado] = useState({ ok: '', error: '' });
  const [guardando, setGuardando] = useState(false);

  function agregarGenero(event) {
    event.preventDefault();
    const g = nuevoGenero.trim();
    if (!g) return;
    if (g.length > 60) {
      setEstado({ ok: '', error: 'Cada género puede tener hasta 60 caracteres' });
      return;
    }
    if (genres.length >= 20) {
      setEstado({ ok: '', error: 'Podés elegir hasta 20 géneros' });
      return;
    }
    if (!genres.some((x) => x.toLowerCase() === g.toLowerCase())) setGenres([...genres, g]);
    setNuevoGenero('');
    setEstado({ ok: '', error: '' });
  }

  async function guardar() {
    setGuardando(true);
    setEstado({ ok: '', error: '' });
    try {
      const data = await usersService.updatePreferences({ theme, language, genres });
      onSaved(data.preferences);
      setEstado({ ok: 'Preferencias guardadas', error: '' });
    } catch (err) {
      setEstado({ ok: '', error: err.message });
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="settings__section form-stack">
      <h2 className="home__heading">Preferencias</h2>
      <div className="field">
        <label className="field__label" htmlFor="theme">
          Tema
        </label>
        <select id="theme" className="status-select" value={theme} onChange={(event) => setTheme(event.target.value)}>
          <option value="dark">Oscuro</option>
          <option value="light">Claro</option>
        </select>
      </div>
      <div className="field">
        <label className="field__label" htmlFor="language">
          Idioma
        </label>
        <select id="language" className="status-select" value={language} onChange={(event) => setLanguage(event.target.value)}>
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>
      </div>
      <div className="field">
        <span className="field__label">Géneros preferidos</span>
        <ul className="tag-list">
          {genres.map((g) => (
            <li key={g} className="tag">
              {g}
              <button
                type="button"
                className="tag__remove"
                onClick={() => setGenres(genres.filter((x) => x !== g))}
                aria-label={`Quitar ${g}`}
              >
                ×
              </button>
            </li>
          ))}
          {genres.length === 0 && <li className="field__hint">Ninguno todavía</li>}
        </ul>
        <form className="settings__inline" onSubmit={agregarGenero}>
          <input
            className="field__input"
            value={nuevoGenero}
            onChange={(event) => setNuevoGenero(event.target.value)}
            placeholder="Ej. Rock, Pop, Jazz"
            aria-label="Nuevo género"
            maxLength={60}
          />
          <Button type="submit" variant="secondary">
            Agregar
          </Button>
        </form>
      </div>
      <Resultado {...estado} />
      <Button onClick={guardar} loading={guardando}>
        Guardar preferencias
      </Button>
    </div>
  );
}

// Sección de ajustes locales: reproducción, notificaciones o privacidad
function AjustesGrupo({ preferences, onSaved, grupo, titulo, campos }) {
  const [valores, setValores] = useState(() => settingsFrom(preferences, grupo));
  const [estado, setEstado] = useState({ ok: '', error: '' });
  const [guardando, setGuardando] = useState(false);

  function cambiar(clave, valor) {
    setValores((prev) => ({ ...prev, [clave]: valor }));
    setEstado({ ok: '', error: '' });
  }

  async function guardar() {
    setGuardando(true);
    setEstado({ ok: '', error: '' });
    try {
      // El backend fusiona settings por grupo: se manda el grupo completo
      const data = await usersService.updatePreferences({ settings: { [grupo]: valores } });
      onSaved(data.preferences);
      setEstado({ ok: 'Ajustes guardados', error: '' });
    } catch (err) {
      setEstado({ ok: '', error: err.message });
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="settings__section form-stack">
      <h2 className="home__heading">{titulo}</h2>
      {campos(valores, cambiar)}
      <Resultado {...estado} />
      <Button onClick={guardar} loading={guardando}>
        Guardar
      </Button>
    </div>
  );
}

export default function Settings() {
  const { setUser, preferences, setPreferences } = useAuth();
  const { data, loading, error, reload } = useFetch(() => usersService.getProfile(), []);

  if (loading) return <Spinner label="Cargando configuración..." />;

  if (error) {
    return (
      <section className="settings">
        <h1 className="page__title">Configuración</h1>
        <ErrorMessage message={error} onRetry={reload} />
      </section>
    );
  }

  const prefs = preferences || data.preferences;

  return (
    <section className="settings">
      <h1 className="page__title">Configuración</h1>

      <PerfilForm user={data.user} onSaved={setUser} />
      <PreferenciasForm preferences={prefs} onSaved={setPreferences} />

      <AjustesGrupo
        preferences={prefs}
        onSaved={setPreferences}
        grupo="playback"
        titulo="Reproducción"
        campos={(v, set) => (
          <>
            <Check label="Pasar automáticamente a la siguiente canción" checked={v.autoplay} onChange={(x) => set('autoplay', x)} />
            <div className="field">
              <label className="field__label" htmlFor="volumen">
                Volumen inicial: {Math.round(v.volume * 100)}%
              </label>
              <input
                id="volumen"
                type="range"
                className="progress__range"
                min={0}
                max={1}
                step={0.05}
                value={v.volume}
                onChange={(event) => set('volume', Number(event.target.value))}
                style={{ '--fill': `${v.volume * 100}%` }}
              />
            </div>
          </>
        )}
      />

      <AjustesGrupo
        preferences={prefs}
        onSaved={setPreferences}
        grupo="notifications"
        titulo="Notificaciones"
        campos={(v, set) => (
          <>
            <Check label="Nuevos lanzamientos de tus artistas" checked={v.newReleases} onChange={(x) => set('newReleases', x)} />
            <Check label="Recomendaciones para vos" checked={v.recommendations} onChange={(x) => set('recommendations', x)} />
            <Check label="Resumen semanal de escucha" checked={v.weeklySummary} onChange={(x) => set('weeklySummary', x)} />
          </>
        )}
      />

      <AjustesGrupo
        preferences={prefs}
        onSaved={setPreferences}
        grupo="privacy"
        titulo="Privacidad"
        campos={(v, set) => (
          <>
            <Check label="Perfil público" checked={v.publicProfile} onChange={(x) => set('publicProfile', x)} />
            <Check label="Mostrar mi actividad reciente" checked={v.showActivity} onChange={(x) => set('showActivity', x)} />
            <Check label="Mostrar mis estadísticas" checked={v.showStats} onChange={(x) => set('showStats', x)} />
          </>
        )}
      />
    </section>
  );
}
