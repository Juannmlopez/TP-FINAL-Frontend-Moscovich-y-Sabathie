// Barra superior: botón de menú (mobile), usuario y cerrar sesión
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [saliendo, setSaliendo] = useState(false);

  const nombre = user?.displayName || user?.username || '';

  async function handleLogout() {
    setSaliendo(true);
    await logout(); // AuthContext limpia el usuario y redirige a /login
  }

  return (
    <header className="navbar">
      <button type="button" className="navbar__menu" onClick={onMenuClick} aria-label="Abrir menú">
        ☰
      </button>

      <div className="navbar__right">
        <Link to="/profile" className="navbar__user">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="avatar" />
          ) : (
            <span className="avatar avatar--initial">{nombre.charAt(0).toUpperCase()}</span>
          )}
          <span className="navbar__name">{nombre}</span>
        </Link>
        <Button variant="ghost" onClick={handleLogout} loading={saliendo}>
          Cerrar sesión
        </Button>
      </div>
    </header>
  );
}
