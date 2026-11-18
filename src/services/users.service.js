// Perfil y preferencias del usuario: /api/users
import api from './api';

export async function getProfile() {
  const response = await api.get('/users/me');
  return response.data;
}

// { displayName, bio, avatarUrl }
export async function updateProfile(data) {
  const response = await api.patch('/users/me', data);
  return response.data;
}

// { theme, language, showExplicit, profilePublic, yearlyGoal, genreIds }
export async function updatePreferences(data) {
  const response = await api.put('/users/me/preferences', data);
  return response.data;
}
