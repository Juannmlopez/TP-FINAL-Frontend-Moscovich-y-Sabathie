// Recuperación de contraseña: se pide el email y el backend manda el enlace para restablecerla.
// Usa el mismo estilo que login y registro.
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authService from '../../services/auth.service';
import AuthHeader from '../../components/layout/AuthHeader';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import ErrorMessage from '../../components/ui/ErrorMessage';
import { validarEmail } from '../../utils/validators';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [errorCampo, setErrorCampo] = useState('');
  const [errorServidor, setErrorServidor] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorServidor('');
    const mensaje = validarEmail(email);
    setErrorCampo(mensaje || '');
    if (mensaje) return;

    setEnviando(true);
    try {
      await authService.forgotPassword(email.trim().toLowerCase());
      setEnviado(true);
    } catch (error) {
      setErrorServidor(error.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="auth login">
      <AuthHeader title="Recuperar contraseña" onBack={() => navigate('/login')} />

      {enviado ? (
        <div className="auth__form">
          <p className="auth__notice auth__notice--success" role="status">
            Si el email está registrado, te enviamos un enlace para restablecer tu contraseña. Revisá tu bandeja de entrada.
          </p>
          <Link to="/login" className="btn btn--light btn--lg auth__next">
            Volver a iniciar sesión
          </Link>
        </div>
      ) : (
        <form className="auth__form" onSubmit={handleSubmit} noValidate>
          <p>Ingresá el email de tu cuenta y te mandamos un enlace para crear una contraseña nueva.</p>
          <ErrorMessage message={errorServidor} />
          <Input
            className="field--step"
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setErrorCampo('');
            }}
            error={errorCampo}
          />
          <Button type="submit" variant="light" className="auth__next btn--lg" loading={enviando}>
            Enviar enlace
          </Button>
        </form>
      )}

      <p className="auth__footer">
        ¿Te acordaste? <Link to="/login">Iniciá sesión</Link>
      </p>
    </div>
  );
}
