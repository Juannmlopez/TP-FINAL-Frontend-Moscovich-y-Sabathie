// Ajustes que el backend todavía no guarda (reproducción, notificaciones, privacidad).
// Se guardan en el navegador, separados por usuario.
const DEFAULTS = {
  playback: { autoplay: true, volume: 0.8 },
  notifications: { newReleases: true, weeklySummary: false, recommendations: true },
  privacy: { publicProfile: true, showActivity: true, showStats: false },
};

function clave(userId, grupo) {
  return `settings:${userId || 'anon'}:${grupo}`;
}

export function loadSettings(userId, grupo) {
  try {
    const guardado = JSON.parse(localStorage.getItem(clave(userId, grupo)));
    return { ...DEFAULTS[grupo], ...(guardado || {}) };
  } catch {
    return { ...DEFAULTS[grupo] };
  }
}

export function saveSettings(userId, grupo, valores) {
  localStorage.setItem(clave(userId, grupo), JSON.stringify(valores));
}
