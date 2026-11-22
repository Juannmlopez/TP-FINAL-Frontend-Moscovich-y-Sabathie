// Funciones para mostrar datos con formato legible

// 225000 → "3:45"
export function formatDuration(ms) {
  if (ms == null || Number.isNaN(Number(ms))) return '';
  const totalSegundos = Math.floor(Number(ms) / 1000);
  const minutos = Math.floor(totalSegundos / 60);
  const segundos = totalSegundos % 60;
  return `${minutos}:${String(segundos).padStart(2, '0')}`;
}

// "2026-11-18T13:06:12Z" → "18 de noviembre de 2026"
export function formatDate(iso) {
  if (!iso) return '';
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return '';
  return fecha.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
}

// 135 → "2 h 15 min", 45 → "45 min"
export function formatMinutes(min) {
  const total = Math.round(Number(min) || 0);
  const horas = Math.floor(total / 60);
  const minutos = total % 60;
  if (horas === 0) return `${minutos} min`;
  if (minutos === 0) return `${horas} h`;
  return `${horas} h ${minutos} min`;
}

// Segundos (con decimales) → "0:27"
export function formatTime(segundos) {
  const total = Math.max(0, Math.floor(Number(segundos) || 0));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}
