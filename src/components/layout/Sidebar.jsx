// Menú lateral de navegación. En mobile se abre y cierra desde el Navbar
import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/search', label: 'Buscar' },
  { to: '/artists', label: 'Artistas' },
  { to: '/library', label: 'Biblioteca' },
  { to: '/queue', label: 'Cola de reproducción' },
  { to: '/collections', label: 'Playlists' },
  { to: '/stats', label: 'Estadísticas' },
  { to: '/profile', label: 'Perfil' },
  { to: '/settings', label: 'Configuración' },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Fondo oscuro detrás del menú (solo se ve en mobile) */}
      {open && <div className="sidebar__backdrop" onClick={onClose} />}

      <aside className={`sidebar ${open ? 'sidebar--open' : ''}`} aria-label="Navegación principal">
        <div className="sidebar__brand">My Collection</div>
        <nav>
          <ul className="sidebar__list">
            {LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  onClick={onClose}
                  className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
