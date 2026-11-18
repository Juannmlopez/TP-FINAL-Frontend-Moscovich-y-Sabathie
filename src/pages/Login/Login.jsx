// Inicio de sesión con usuario o email + contraseña
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
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
  // Mensaje que manda AuthContext cuando la sesión vence
  const aviso = location.state?.message;

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
      ? { email: identifier, password: form.password }
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
      <div className="auth__card">
        <p className="auth__brand">My Collection</p>
        <h1 className="auth__title">Iniciar sesión</h1>

        {aviso && !errorServidor && <p className="login__notice">{aviso}</p>}
        <ErrorMessage message={errorServidor} />

        <form className="auth__form" onSubmit={handleSubmit} noValidate>
          <Input
            label="Usuario o email"
            name="identifier"
            autoComplete="username"
            value={form.identifier}
            onChange={handleChange}
            error={errores.identifier}
          />
          <Input
            label="Contraseña"
            name="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            error={errores.password}
          />
          <Button type="submit" fullWidth loading={enviando}>
            Ingresar
          </Button>
        </form>

        <p className="auth__footer">
          ¿No tenés cuenta? <Link to="/register">Registrate</Link>
        </p>
      </div>
    </div>
  );
}
