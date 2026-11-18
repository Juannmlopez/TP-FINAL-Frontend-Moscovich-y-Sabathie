// Playlists del usuario: /api/collections
import api from './api';

export async function getCollections() {
  const response = await api.get('/collections');
  return response.data;
}

// { name, description }
export async function createCollection(data) {
  const response = await api.post('/collections', data);
  return response.data;
}

export async function getCollection(id) {
  const response = await api.get(`/collections/${id}`);
  return response.data;
}

export async function updateCollection(id, data) {
  const response = await api.patch(`/collections/${id}`, data);
  return response.data;
}

export async function deleteCollection(id) {
  const response = await api.delete(`/collections/${id}`);
  return response.data;
}

export async function addItem(id, contentId) {
  const response = await api.post(`/collections/${id}/items`, { contentId });
  return response.data;
}

export async function removeItem(id, contentId) {
  const response = await api.delete(`/collections/${id}/items/${contentId}`);
  return response.data;
}
