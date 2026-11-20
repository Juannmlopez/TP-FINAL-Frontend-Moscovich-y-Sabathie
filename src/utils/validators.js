// Validaciones de formularios de autenticación.
// Mismas reglas que el backend (validators/auth.validator.js): si cambian allá, cambiarlas acá.
// Cada función devuelve el mensaje de error o '' si el valor es válido.

export const USERNAME_REGEX = /^[A-Za-z0-9_.]{3,30}$/;
export const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
export const EMAIL_MAX = 255;
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 72; // límite de bcrypt

export function validarUsername(username) {
  const valor = username.trim();
  if (!valor) return 'Ingresá un nombre de usuario';
  if (!USERNAME_REGEX.test(valor)) return 'Entre 3 y 30 caracteres: letras, números, "_" o "."';
  return '';
}

export function validarEmail(email) {
  const valor = email.trim();
  if (!valor) return 'Ingresá tu email';
  if (valor.length > EMAIL_MAX) return `El email puede tener como máximo ${EMAIL_MAX} caracteres`;
  if (!EMAIL_REGEX.test(valor)) return 'Ingresá un email válido';
  return '';
}

export function validarPassword(password) {
  if (!password) return 'Ingresá una contraseña';
  if (password.length < PASSWORD_MIN) return `La contraseña debe tener al menos ${PASSWORD_MIN} caracteres`;
  if (password.length > PASSWORD_MAX) return `La contraseña puede tener como máximo ${PASSWORD_MAX} caracteres`;
  return '';
}

// Convierte los "details" de un error del backend en errores por campo.
// Acepta { campo: mensaje } o [{ field|path, message }]
export function erroresDelServidor(details) {
  if (!details) return {};
  if (Array.isArray(details)) {
    return Object.fromEntries(
      details
        .map((d) => [d.field || (Array.isArray(d.path) ? d.path[0] : d.path), d.message || d.msg])
        .filter(([campo, mensaje]) => campo && mensaje)
    );
  }
  if (typeof details === 'object') {
    return Object.fromEntries(Object.entries(details).filter(([, m]) => typeof m === 'string'));
  }
  return {};
}
