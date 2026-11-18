// Selector del estado de un contenido en la biblioteca (enum library_status).
// No llama a la API: avisa el cambio con onChange y la página usa libraryService.updateItem.
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
      {/* TODO: opción "Agregar a la biblioteca" cuando todavía no está guardado */}
      {STATUSES.map((status) => (
        <option key={status.value} value={status.value}>
          {status.label}
        </option>
      ))}
    </select>
  );
}
