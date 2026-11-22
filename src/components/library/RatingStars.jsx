// Puntuación de 1 a 5 estrellas. No llama a la API: avisa con onChange y la página
// usa libraryService.setRating / removeRating.
// Al tocar la estrella que ya está elegida, se quita la puntuación (onChange(0)).
// Props: value (0 = sin puntuar), onChange(puntaje), readOnly
import { useState } from 'react';

const ESTRELLAS = [1, 2, 3, 4, 5];

export default function RatingStars({ value = 0, onChange, readOnly = false, disabled = false }) {
  const [hover, setHover] = useState(0);
  const mostrado = hover || value;

  return (
    <div className="rating-stars" role="group" aria-label="Puntuación" onMouseLeave={() => setHover(0)}>
      {ESTRELLAS.map((n) => (
        <button
          key={n}
          type="button"
          className={`rating-stars__star ${n <= mostrado ? 'rating-stars__star--on' : ''}`}
          onClick={() => onChange?.(n === value ? 0 : n)}
          onMouseEnter={() => !readOnly && setHover(n)}
          disabled={readOnly || disabled}
          aria-label={n === value ? `${n} de 5 (tocá para quitar)` : `${n} de 5`}
          aria-pressed={n <= value}
        >
          {n <= mostrado ? '★' : '☆'}
        </button>
      ))}
    </div>
  );
}
