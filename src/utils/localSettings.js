// Ajustes de reproducción, notificaciones y privacidad. Se guardan en el backend dentro de
// preferences.settings = { playback, notifications, privacy }; acá están los valores por defecto.
export const DEFAULT_SETTINGS = {
  playback: { autoplay: true, volume: 0.8 },
  notifications: { newReleases: true, weeklySummary: false, recommendations: true },
  privacy: { publicProfile: true, showActivity: true, showStats: false },
};

// Devuelve el grupo pedido con los valores por defecto completados
export function settingsFrom(preferences, grupo) {
  return { ...DEFAULT_SETTINGS[grupo], ...(preferences?.settings?.[grupo] || {}) };
}
