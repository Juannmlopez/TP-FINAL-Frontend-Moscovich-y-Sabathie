// Selector del estado de un contenido en la biblioteca (enum library_status).
// No llama a la API: avisa el cambio con onChange y la página usa libraryService.
// Si value está vacío, el contenido todavía no está guardado y se muestra una opción para agregarlo.
// Props: value, onChange(nuevoEstado), disabled
import { STATUSES } from '../../utils/constants';

export default function StatusSelect({ value = '', onChange, disabled = false }) {
  return (
    <select
      className="status-select"
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      disabled={disabled}
      aria-label="Estado en la biblioteca"
    >
      {!value && (
        <option value="" disabled>
          Agregar a la biblioteca
        </option>
      )}
      {STATUSES.map((status) => (
        <option key={status.value} value={status.value}>
          {status.label}
        </option>
      ))}
    </select>
  );
}
