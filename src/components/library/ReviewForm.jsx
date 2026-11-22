// Formulario para escribir o editar la reseña de un contenido (1 a 5000 caracteres).
// No llama a la API: la página recibe el texto en onSubmit y usa reviewsService.saveReview.
// Props: initialValue, onSubmit(texto), onDelete (solo si ya existe reseña), loading
import { useState } from 'react';
import Button from '../ui/Button';

const MAX = 5000;

export default function ReviewForm({ initialValue = '', onSubmit, onDelete, loading = false }) {
  const [body, setBody] = useState(initialValue);
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const texto = body.trim();
    if (texto.length < 1) {
      setError('Escribí tu reseña antes de guardar');
      return;
    }
    if (texto.length > MAX) {
      setError(`La reseña no puede superar los ${MAX} caracteres`);
      return;
    }
    setError('');
    onSubmit?.(texto);
  }

  return (
    <form className="review-form" onSubmit={handleSubmit} noValidate>
      <textarea
        className={`field__input ${error ? 'field__input--error' : ''}`}
        value={body}
        onChange={(event) => {
          setBody(event.target.value);
          setError('');
        }}
        maxLength={MAX}
        rows={4}
        placeholder="¿Qué te pareció?"
        aria-label="Reseña"
        aria-invalid={Boolean(error)}
      />
      <div className="review-form__meta">
        <span className="field__error">{error}</span>
        <span className="field__hint">
          {body.length} / {MAX}
        </span>
      </div>
      <div className="review-form__actions">
        <Button type="submit" loading={loading}>
          {initialValue ? 'Actualizar reseña' : 'Guardar reseña'}
        </Button>
        {onDelete && (
          <Button variant="ghost" onClick={onDelete} disabled={loading}>
            Borrar
          </Button>
        )}
      </div>
    </form>
  );
}
