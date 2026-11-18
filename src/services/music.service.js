// Catálogo de música (API externa a través del backend): /api/music
import api from './api';

// q = texto, type = track | album | artist, sort = criterio de orden
export async function search({ q, type, sort } = {}) {
  const response = await api.get('/music/search', { params: { q, type, sort } });
  return response.data;
}

export async function getFeatured() {
  const response = await api.get('/music/featured');
  return response.data;
}

export async function getArtist(id) {
  const response = await api.get(`/music/artists/${id}`);
  return response.data;
}

export async function getArtistAlbums(id) {
  const response = await api.get(`/music/artists/${id}/albums`);
  return response.data;
}

export async function getAlbum(id) {
  const response = await api.get(`/music/albums/${id}`);
  return response.data;
}

export async function getTrack(id) {
  const response = await api.get(`/music/tracks/${id}`);
  return response.data;
}
