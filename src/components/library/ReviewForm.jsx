// Formulario para escribir o editar la reseña de un contenido (1 a 5000 caracteres).
// No llama a la API: la página recibe el texto en onSubmit y usa reviewsService.saveReview.
// Props: initialValue, onSubmit(texto), onDelete, loading
import { useState } from 'react';
import Button from '../ui/Button';

export default function ReviewForm({ initialValue = '', onSubmit, onDelete, loading = false }) {
  const [body, setBody] = useState(initialValue);

  function handleSubmit(event) {
    event.preventDefault();
    // TODO: validar 1 a 5000 caracteres y mostrar el error debajo del textarea
    onSubmit?.(body.trim());
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <textarea
        className="field__input"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        maxLength={5000}
        rows={4}
        placeholder="¿Qué te pareció?"
        aria-label="Reseña"
      />
      {/* TODO: contador de caracteres (body.length / 5000) */}
      <Button type="submit" loading={loading}>
        Guardar reseña
      </Button>
      {onDelete && (
        <Button variant="ghost" onClick={onDelete}>
          Borrar
        </Button>
      )}
    </form>
  );
}
