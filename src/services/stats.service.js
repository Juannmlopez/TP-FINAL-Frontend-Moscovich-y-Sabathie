// Estadísticas, actividad, historial y resumen de inicio
import api from './api';

// Resumen anual tipo Wrapped
export async function getStats(year) {
  const response = await api.get('/stats', { params: { year } });
  return response.data;
}

export async function getActivity() {
  const response = await api.get('/activity');
  return response.data;
}

export async function getHistory() {
  const response = await api.get('/history');
  return response.data;
}

// { contentId, playedAt, msPlayed }
export async function addHistoryEntry(data) {
  const response = await api.post('/history', data);
  return response.data;
}

// Resumen personal para la pantalla de inicio
export async function getHome() {
  const response = await api.get('/home');
  return response.data;
}
