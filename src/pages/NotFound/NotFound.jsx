// Página para rutas que no existen
import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found">
      <p className="not-found__code">404</p>
      <h1 className="not-found__title">Página no encontrada</h1>
      <p className="not-found__text">La página que buscás no existe o se movió.</p>
      <Link to="/" className="btn btn--primary">
        Volver al inicio
      </Link>
    </div>
  );
}
