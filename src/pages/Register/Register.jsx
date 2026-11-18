// Registro de usuario nuevo. Al terminar, el backend ya deja la sesión iniciada
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import ErrorMessage from '../../components/ui/ErrorMessage';
import './Register.css';

// Mismas reglas que el backend (validators/auth.validator.js)
const USERNAME_REGEX = /^[A-Za-z0-9_.]{3,30}$/;
const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Devuelve un objeto { campo: mensaje } con los errores encontrados
function validar({ username, email, password, confirmPassword }) {
  const errores = {};
  if (!USERNAME_REGEX.test(username)) {
    errores.username = 'Entre 3 y 30 caracteres: letras, números, "_" o "."';
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    errores.email = 'Ingresá un email válido';
  }
  if (password.length < 8) {
    errores.password = 'La contraseña debe tener al menos 8 caracteres';
  } else if (password.length > 72) {
    errores.password = 'La contraseña puede tener como máximo 72 caracteres';
  }
  if (confirmPassword !== password) {
    errores.confirmPassword = 'Las contraseñas no coinciden';
  }
  return errores;
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState('');
  const [enviando, setEnviando] = useState(false);

  const destino = location.state?.from?.pathname || '/';

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorServidor('');

    const nuevosErrores = validar(form);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setEnviando(true);
    try {
      // confirmPassword solo se valida acá, no se manda al backend
      await register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate(destino, { replace: true });
    } catch (error) {
      setErrorServidor(error.message);
      setEnviando(false);
    }
  }

  return (
    <div className="auth register">
      <div className="auth__card">
        <p className="auth__brand">My Collection</p>
        <h1 className="auth__title">Crear cuenta</h1>

        <ErrorMessage message={errorServidor} />

        <form className="auth__form" onSubmit={handleSubmit} noValidate>
          <Input
            label="Nombre de usuario"
            name="username"
            autoComplete="username"
            value={form.username}
            onChange={handleChange}
            error={errores.username}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            error={errores.email}
          />
          <Input
            label="Contraseña"
            name="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            error={errores.password}
          />
          <Input
            label="Repetir contraseña"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errores.confirmPassword}
          />
          <Button type="submit" fullWidth loading={enviando}>
            Registrarme
          </Button>
        </form>

        <p className="auth__footer">
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </div>
    </div>
  );
}
