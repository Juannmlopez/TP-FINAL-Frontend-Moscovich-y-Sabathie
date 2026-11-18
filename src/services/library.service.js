// Biblioteca, favoritos y puntuaciones: /api/library
import api from './api';

// Filtros opcionales: { status, favorite, type, sort }
export async function getLibrary(filters = {}) {
  const response = await api.get('/library', { params: filters });
  return response.data;
}

// { contentId, status }
export async function addItem(data) {
  const response = await api.post('/library', data);
  return response.data;
}

// { status, isFavorite }
export async function updateItem(contentId, data) {
  const response = await api.patch(`/library/${contentId}`, data);
  return response.data;
}

export async function removeItem(contentId) {
  const response = await api.delete(`/library/${contentId}`);
  return response.data;
}

// score de 1 a 5
export async function setRating(contentId, score) {
  const response = await api.put(`/library/${contentId}/rating`, { score });
  return response.data;
}

export async function removeRating(contentId) {
  const response = await api.delete(`/library/${contentId}/rating`);
  return response.data;
}
