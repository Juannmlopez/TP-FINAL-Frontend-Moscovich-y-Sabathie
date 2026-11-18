// Puntuación de 1 a 5 estrellas. No llama a la API: avisa con onChange y la página
// usa libraryService.setRating / removeRating.
// Props: value (0 = sin puntuar), onChange(puntaje), readOnly
const ESTRELLAS = [1, 2, 3, 4, 5];

export default function RatingStars({ value = 0, onChange, readOnly = false }) {
  return (
    <div className="rating-stars" role="group" aria-label="Puntuación">
      {ESTRELLAS.map((n) => (
        <button
          key={n}
          type="button"
          className="rating-stars__star"
          onClick={() => onChange?.(n)}
          disabled={readOnly}
          aria-label={`${n} de 5`}
        >
          {n <= value ? '★' : '☆'}
        </button>
      ))}
      {/* TODO: hover que previsualice la puntuación y opción para quitarla (onChange(0)) */}
    </div>
  );
}
