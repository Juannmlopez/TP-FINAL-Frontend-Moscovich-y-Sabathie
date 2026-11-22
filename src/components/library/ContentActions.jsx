// Acciones del usuario sobre un contenido (canción, álbum o artista): estado en la biblioteca,
// favorito, puntuación con estrellas y reseña (crear, editar y borrar).
// Props: content ({ id, title, library, rating, review }, tal como lo devuelve el backend en el detalle),
//        onLibraryChange(libraryItem | null) opcional
import { useState } from 'react';
import * as libraryService from '../../services/library.service';
import * as reviewsService from '../../services/reviews.service';
import StatusSelect from './StatusSelect';
import FavoriteButton from './FavoriteButton';
import RatingStars from './RatingStars';
import ReviewForm from './ReviewForm';
import Button from '../ui/Button';
import ErrorMessage from '../ui/ErrorMessage';

export default function ContentActions({ content, onLibraryChange }) {
  const [library, setLibrary] = useState(content.library ?? null);
  const [rating, setRating] = useState(content.rating ?? 0);
  const [review, setReview] = useState(content.review ?? '');
  const [editando, setEditando] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');

  // Ejecuta una acción mostrando el error del backend si falla
  async function run(accion, mensaje = '') {
    setBusy(true);
    setError('');
    setAviso('');
    try {
      await accion();
      if (mensaje) setAviso(mensaje);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function aplicarLibrary(item) {
    const nuevo = item ? { status: item.status, isFavorite: item.isFavorite } : null;
    setLibrary(nuevo);
    onLibraryChange?.(nuevo);
  }

  function cambiarEstado(status) {
    run(async () => {
      const item = library
        ? await libraryService.updateItem(content.id, { status })
        : await libraryService.addItem({ contentId: content.id, status });
      aplicarLibrary(item);
    }, 'Estado actualizado');
  }

  function cambiarFavorito(isFavorite) {
    run(async () => {
      // Si todavía no está guardado, primero se agrega a la biblioteca
      if (!library) await libraryService.addItem({ contentId: content.id });
      const item = await libraryService.updateItem(content.id, { isFavorite });
      aplicarLibrary(item);
    });
  }

  function quitarDeBiblioteca() {
    run(async () => {
      await libraryService.removeItem(content.id);
      aplicarLibrary(null);
    }, 'Quitado de tu biblioteca');
  }

  function puntuar(score) {
    run(async () => {
      if (score === 0) await libraryService.removeRating(content.id);
      else await libraryService.setRating(content.id, score);
      setRating(score);
    });
  }

  function guardarResena(body) {
    run(async () => {
      await reviewsService.saveReview(content.id, body);
      setReview(body);
      setEditando(false);
    }, 'Reseña guardada');
  }

  function borrarResena() {
    run(async () => {
      await reviewsService.deleteReview(content.id);
      setReview('');
      setEditando(false);
    }, 'Reseña borrada');
  }

  return (
    <section className="content-actions" aria-label="Tu biblioteca">
      <div className="content-actions__row">
        {!library && (
          <Button onClick={() => cambiarEstado('quiero_escuchar')} disabled={busy}>
            Guardar en biblioteca
          </Button>
        )}
        <StatusSelect value={library?.status || ''} onChange={cambiarEstado} disabled={busy} />
        <FavoriteButton active={Boolean(library?.isFavorite)} onToggle={cambiarFavorito} disabled={busy} />
        {library && (
          <Button variant="ghost" onClick={quitarDeBiblioteca} disabled={busy}>
            Quitar de la biblioteca
          </Button>
        )}
      </div>

      <div className="content-actions__row">
        <span className="content-actions__label">Tu puntuación</span>
        <RatingStars value={rating} onChange={puntuar} disabled={busy} />
      </div>

      <div className="content-actions__review">
        <h3 className="content-actions__label">Tu reseña</h3>
        {review && !editando ? (
          <>
            <p className="content-actions__text">{review}</p>
            <div className="review-form__actions">
              <Button variant="secondary" onClick={() => setEditando(true)} disabled={busy}>
                Editar
              </Button>
              <Button variant="ghost" onClick={borrarResena} disabled={busy}>
                Borrar
              </Button>
            </div>
          </>
        ) : (
          <>
            <ReviewForm
              key={review}
              initialValue={review}
              onSubmit={guardarResena}
              onDelete={review ? borrarResena : undefined}
              loading={busy}
            />
            {review && (
              <Button variant="ghost" onClick={() => setEditando(false)}>
                Cancelar
              </Button>
            )}
          </>
        )}
      </div>

      {aviso && (
        <p className="notice notice--success" role="status">
          {aviso}
        </p>
      )}
      <ErrorMessage message={error} />
    </section>
  );
}
