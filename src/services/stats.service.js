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

// { contentId, playedAt, msPlayed }
export async function addHistoryEntry(data) {
  const response = await api.post('/history', data);
  return response.data;
}
