// Modal para agregar un contenido a una playlist existente o a una nueva.
// Props: open, onClose, content ({ id, title })
import { useEffect, useState } from 'react';
import * as collectionsService from '../../services/collections.service';
import Modal from '../ui/Modal';
import Spinner from '../ui/Spinner';
import ErrorMessage from '../ui/ErrorMessage';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function AddToPlaylistModal({ open, onClose, content }) {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [nombre, setNombre] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    let cancelado = false;
    setLoading(true);
    setError('');
    setAviso('');
    collectionsService
      .getCollections()
      .then((data) => !cancelado && setCollections(data.collections || []))
      .catch((err) => !cancelado && setError(err.message))
      .finally(() => !cancelado && setLoading(false));
    return () => {
      cancelado = true;
    };
  }, [open]);

  async function agregar(collection) {
    setGuardando(true);
    setError('');
    setAviso('');
    try {
      await collectionsService.addItem(collection.id, content.id);
      setAviso(`Agregada a "${collection.name}"`);
    } catch (err) {
      setError(err.message); // ej. 409 "Ya está en la playlist"
    } finally {
      setGuardando(false);
    }
  }

  async function crearYAgregar(event) {
    event.preventDefault();
    const limpio = nombre.trim();
    if (limpio.length < 1 || limpio.length > 80) {
      setError('El nombre debe tener entre 1 y 80 caracteres');
      return;
    }
    setGuardando(true);
    setError('');
    setAviso('');
    try {
      const creada = await collectionsService.createCollection({ name: limpio });
      await collectionsService.addItem(creada.id, content.id);
      setCollections((prev) => [{ ...creada, itemCount: 1 }, ...prev]);
      setNombre('');
      setAviso(`Playlist "${creada.name}" creada y canción agregada`);
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Agregar a playlist">
      <p className="field__hint">{content?.title}</p>
      {loading ? (
        <Spinner label="Cargando playlists..." />
      ) : (
        <ul className="playlist-picker">
          {collections.map((col) => (
            <li key={col.id}>
              <button type="button" className="playlist-picker__item" onClick={() => agregar(col)} disabled={guardando}>
                <span>{col.name}</span>
                <span className="field__hint">{col.itemCount} canciones</span>
              </button>
            </li>
          ))}
          {collections.length === 0 && <li className="field__hint">Todavía no tenés playlists. Creá la primera abajo.</li>}
        </ul>
      )}

      <form className="playlist-picker__new" onSubmit={crearYAgregar} noValidate>
        <Input
          label="Nueva playlist"
          value={nombre}
          maxLength={80}
          onChange={(event) => setNombre(event.target.value)}
          placeholder="Nombre de la playlist"
        />
        <Button type="submit" variant="secondary" loading={guardando}>
          Crear y agregar
        </Button>
      </form>

      {aviso && (
        <p className="notice notice--success" role="status">
          {aviso}
        </p>
      )}
      <ErrorMessage message={error} />
    </Modal>
  );
}
