// Estado global de la sesión: quién es el usuario y si todavía lo estamos comprobando
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/auth.service';

// Se exporta para que hooks/useAuth.js lo pueda leer
// oxlint-disable-next-line react/only-export-components
export const AuthContext = createContext(null);

const MENSAJE_VENCIDA = 'Tu sesión venció, volvé a iniciar sesión';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Aviso para mostrar en el login (lo pasa ProtectedRoute al redirigir)
  const [authMessage, setAuthMessage] = useState('');
  const navigate = useNavigate();

  // Al cargar la app: si la cookie sigue válida, el backend devuelve el usuario
  useEffect(() => {
    authService
      .me()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // api.js dispara "auth:expired" cuando una ruta privada responde 401.
  // Al quedar user en null, ProtectedRoute manda a /login con el aviso.
  useEffect(() => {
    function handleExpired() {
      setAuthMessage(MENSAJE_VENCIDA);
      setUser(null);
    }
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, []);

  // Después de login/registro, PublicRoute redirige solo a la ruta de origen o a /
  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    setAuthMessage('');
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (formData) => {
    const data = await authService.register(formData);
    setAuthMessage('');
    setUser(data.user); // el backend ya deja la sesión iniciada
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      // Aunque falle la red, del lado del cliente cerramos la sesión igual
      setAuthMessage('');
      setUser(null);
      navigate('/login', {
        replace: true,
        state: { message: 'Cerraste sesión. ¡Hasta la próxima!', noticeType: 'success' },
      });
    }
  }, [navigate]);

  const value = useMemo(
    () => ({ user, loading, authMessage, login, register, logout }),
    [user, loading, authMessage, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
