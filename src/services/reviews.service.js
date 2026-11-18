// Reseñas del usuario
import api from './api';

export async function getReviews() {
  const response = await api.get('/reviews');
  return response.data;
}

// Crea o edita la reseña de un contenido (body de 1 a 5000 caracteres)
export async function saveReview(contentId, body) {
  const response = await api.put(`/library/${contentId}/review`, { body });
  return response.data;
}

export async function deleteReview(contentId) {
  const response = await api.delete(`/library/${contentId}/review`);
  return response.data;
}
