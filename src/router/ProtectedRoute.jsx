// Deja pasar solo si hay sesión; si no, manda a /login recordando de dónde venía
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';

export default function ProtectedRoute() {
  const { user, loading, authMessage } = useAuth();
  const location = useLocation();

  // Todavía estamos preguntando al backend si hay sesión
  if (loading) return <Spinner fullScreen label="Cargando sesión..." />;

  // Sin sesión: al login, recordando la ruta de origen y el aviso (ej. "sesión vencida")
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location, message: authMessage }} />;
  }

  return <Outlet />;
}
