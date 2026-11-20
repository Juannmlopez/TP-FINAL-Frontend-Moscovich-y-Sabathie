// Registro en 3 pasos (pantallas "Registro mail", "Registro contraseña" y "Registro cuenta" del Figma).
// Cada paso valida su campo antes de avanzar. Al terminar, el backend ya deja la sesión iniciada.
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AuthHeader from '../../components/layout/AuthHeader';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import ErrorMessage from '../../components/ui/ErrorMessage';
import { erroresDelServidor, validarEmail, validarPassword, validarUsername } from '../../utils/validators';
import './Register.css';

// Un paso por campo, en el orden del Figma
const PASOS = [
  {
    campo: 'email',
    label: '¿Cuál es tu email?',
    hint: 'Lo vas a usar para iniciar sesión.',
    type: 'email',
    autoComplete: 'email',
    validar: validarEmail,
  },
  {
    campo: 'password',
    label: 'Creá una contraseña',
    hint: 'Usá al menos 8 caracteres.',
    type: 'password',
    autoComplete: 'new-password',
    validar: validarPassword,
  },
  {
    campo: 'username',
    label: 'Elegí tu nombre de usuario',
    hint: 'Así vas a aparecer en tu perfil. Letras, números, "_" o ".".',
    type: 'text',
    autoComplete: 'username',
    validar: validarUsername,
  },
];

const ULTIMO_PASO = PASOS.length - 1;

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [paso, setPaso] = useState(0);
  const [form, setForm] = useState({ email: '', password: '', username: '' });
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState('');
  const [enviando, setEnviando] = useState(false);

  const destino = location.state?.from?.pathname || '/';
  const actual = PASOS[paso];
  const valor = form[actual.campo];
  const valido = !actual.validar(valor);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: undefined }));
    setErrorServidor('');
  }

  function handleBack() {
    setErrorServidor('');
    if (paso === 0) navigate('/welcome');
    else setPaso(paso - 1);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const error = actual.validar(valor);
    if (error) {
      setErrores((prev) => ({ ...prev, [actual.campo]: error }));
      return;
    }

    if (paso < ULTIMO_PASO) {
      setPaso(paso + 1);
      return;
    }

    setEnviando(true);
    try {
      await register({
        username: form.username.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      navigate(destino, { replace: true });
    } catch (err) {
      // 400 (datos inválidos) o 409 (email o usuario ya usado): el back indica el campo en details.
      // Volvemos al primer paso que tenga error para que se pueda corregir.
      const erroresCampo = erroresDelServidor(err.details);
      const pasoConError = PASOS.findIndex((p) => erroresCampo[p.campo]);
      if (pasoConError !== -1) {
        setErrores(erroresCampo);
        setPaso(pasoConError);
      } else {
        setErrorServidor(err.message);
      }
      setEnviando(false);
    }
  }

  return (
    <div className="auth register">
      <AuthHeader title="Crear cuenta" onBack={handleBack} />

      <p className="register__progress">
        Paso {paso + 1} de {PASOS.length}
      </p>

      <form className="auth__form" onSubmit={handleSubmit} noValidate>
        <Input
          key={actual.campo} // input nuevo en cada paso (autoFocus y autocompletado correctos)
          className="field--step"
          label={actual.label}
          name={actual.campo}
          type={actual.type}
          autoComplete={actual.autoComplete}
          autoFocus
          value={valor}
          onChange={handleChange}
          error={errores[actual.campo]}
          hint={actual.hint}
          adornment={paso === ULTIMO_PASO && valido ? '✓' : null}
        />

        {paso < ULTIMO_PASO ? (
          <Button type="submit" variant="light" className="auth__next" disabled={!valido}>
            Siguiente
          </Button>
        ) : (
          <>
            <p className="auth__legal">
              Al tocar "Crear cuenta", aceptás los Términos de uso y la Política de privacidad de My Collection.
            </p>
            <ErrorMessage message={errorServidor} />
            <Button type="submit" variant="light" className="auth__submit btn--lg" loading={enviando}>
              Crear cuenta
            </Button>
          </>
        )}
      </form>
    </div>
  );
}
