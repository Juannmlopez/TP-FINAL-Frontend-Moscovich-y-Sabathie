// Login y registro: si ya hay sesión no tiene sentido verlos.
// Manda a la ruta de origen (si lo habían mandado al login desde una privada) o a /.
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';

export default function PublicRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner fullScreen label="Cargando..." />;
  if (user) return <Navigate to={location.state?.from?.pathname || '/'} replace />;

  return <Outlet />;
}
