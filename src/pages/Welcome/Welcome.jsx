// Pantalla "Inicio" del Figma: la ve quien entra sin sesión.
// Arriba un collage decorativo de portadas; abajo marca, título y acciones (registrarse / iniciar sesión).
import { Link } from 'react-router-dom';
import './Welcome.css';

// Portadas de fantasía para el collage (formas y colores, sin imágenes externas)
const PORTADAS = [
  { forma: 'cuadrada', color: 'a' },
  { forma: 'redonda', color: 'b' },
  { forma: 'cuadrada', color: 'c' },
  { forma: 'redonda', color: 'd' },
  { forma: 'cuadrada', color: 'e' },
  { forma: 'redonda', color: 'f' },
  { forma: 'cuadrada', color: 'g' },
  { forma: 'redonda', color: 'h' },
  { forma: 'cuadrada', color: 'i' },
];

export default function Welcome() {
  return (
    <div className="welcome">
      <div className="welcome__art" aria-hidden="true">
        {PORTADAS.map((portada, index) => (
          <span
            key={index}
            className={`welcome__cover welcome__cover--${portada.forma} welcome__cover--${portada.color}`}
          />
        ))}
      </div>

      <div className="welcome__content">
        <span className="welcome__logo" aria-hidden="true">
          ♫
        </span>
        <h1 className="welcome__title">
          Millones de canciones.
          <br />
          Todas en tu colección.
        </h1>

        <div className="welcome__actions">
          <Link to="/register" className="btn btn--primary btn--full welcome__cta">
            Registrate gratis
          </Link>
          <Link to="/login" className="welcome__login">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
