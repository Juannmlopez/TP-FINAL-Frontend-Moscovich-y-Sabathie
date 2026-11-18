// Instancia única de axios para hablar con el backend.
// El JWT viaja en una cookie httpOnly: el frontend nunca lo ve ni lo guarda.
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // manda y recibe la cookie del token
});

// Rutas donde un 401 es una respuesta esperable y no significa "sesión vencida"
const RUTAS_SIN_AVISO = ['/auth/me', '/auth/login'];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';

    // Sesión vencida o inválida: avisamos a AuthContext
    if (status === 401 && !RUTAS_SIN_AVISO.some((ruta) => url.endsWith(ruta))) {
      window.dispatchEvent(new Event('auth:expired'));
    }

    // Siempre devolvemos un error con un mensaje legible
    let message = 'Ocurrió un error inesperado';
    if (error.response?.data?.error) {
      message = error.response.data.error; // mensaje del backend: { error }
    } else if (!error.response) {
      message = 'No se pudo conectar con el servidor';
    }

    const normalizado = new Error(message);
    normalizado.status = status;
    normalizado.details = error.response?.data?.details; // errores de validación del back
    return Promise.reject(normalizado);
  }
);

export default api;
