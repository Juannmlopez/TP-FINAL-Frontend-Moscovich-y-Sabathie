// Inicio de sesión con usuario o email + contraseña.
// No tiene pantalla propia en el Figma: usa el mismo estilo que las pantallas de registro.
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AuthHeader from '../../components/layout/AuthHeader';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import ErrorMessage from '../../components/ui/ErrorMessage';
import './Login.css';

// Validación en el cliente: devuelve un objeto { campo: mensaje }
function validar({ identifier, password }) {
  const errores = {};
  if (!identifier.trim()) errores.identifier = 'Ingresá tu usuario o email';
  if (!password) errores.password = 'Ingresá tu contraseña';
  return errores;
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ identifier: '', password: '' });
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Ruta a la que quería entrar antes de que lo mandaran al login
  const destino = location.state?.from?.pathname || '/';
  // Aviso que llega por state: sesión vencida o sesión cerrada
  const aviso = location.state?.message;
  const avisoExito = location.state?.noticeType === 'success';

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: undefined })); // limpia el error al escribir
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorServidor('');

    const nuevosErrores = validar(form);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    // El backend acepta { username } o { email }: lo decidimos por el "@"
    const identifier = form.identifier.trim();
    const credenciales = identifier.includes('@')
      ? { email: identifier.toLowerCase(), password: form.password }
      : { username: identifier, password: form.password };

    setEnviando(true);
    try {
      await login(credenciales);
      navigate(destino, { replace: true });
    } catch (error) {
      setErrorServidor(error.message);
      setEnviando(false);
    }
  }

  return (
    <div className="auth login">
      <AuthHeader title="Iniciar sesión" onBack={() => navigate('/welcome')} />

      <form className="auth__form" onSubmit={handleSubmit} noValidate>
        {aviso && !errorServidor && (
          <p className={`auth__notice ${avisoExito ? 'auth__notice--success' : ''}`} role="status">
            {aviso}
          </p>
        )}
        <ErrorMessage message={errorServidor} />

        <Input
          className="field--step"
          label="Email o nombre de usuario"
          name="identifier"
          autoComplete="username"
          autoFocus
          value={form.identifier}
          onChange={handleChange}
          error={errores.identifier}
        />
        <Input
          className="field--step"
          label="Contraseña"
          name="password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          error={errores.password}
        />
        <Link to="/forgot-password" className="auth__forgot">
          ¿Olvidaste tu contraseña?
        </Link>
        <Button type="submit" variant="light" className="auth__next btn--lg" loading={enviando}>
          Iniciar sesión
        </Button>
      </form>

      <p className="auth__footer">
        ¿No tenés cuenta? <Link to="/register">Registrate</Link>
      </p>
    </div>
  );
}
