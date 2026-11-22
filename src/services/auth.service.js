// Autenticación: /api/auth
import api from './api';

// { username, email, password } → { user }
export async function register(data) {
  const response = await api.post('/auth/register', data);
  return response.data;
}

// { username o email, password } → { user }
export async function login(credentials) {
  const response = await api.post('/auth/login', credentials);
  return response.data;
}

// Borra la cookie en el backend
export async function logout() {
  const response = await api.post('/auth/logout');
  return response.data;
}

// Usuario de la sesión actual → { user } (401 si no hay sesión)
export async function me() {
  const response = await api.get('/auth/me');
  return response.data;
}

// Recuperación de contraseña: { email }. El backend manda un mail con el enlace de recuperación.
export async function forgotPassword(email) {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
}
