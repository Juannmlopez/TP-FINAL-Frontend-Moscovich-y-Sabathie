// Playlists del usuario: crear, renombrar y borrar. Cada una lleva a /collections/:id.
import { useState } from 'react';
import * as collectionsService from '../../services/collections.service';
import { useFetch } from '../../hooks/useFetch';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import CollectionCard from '../../components/cards/CollectionCard';
import './Collections.css';

export default function Collections() {
  const { data, loading, error, reload, setData } = useFetch(() => collectionsService.getCollections(), []);
  // modal: null | { tipo: 'crear' } | { tipo: 'renombrar', collection } | { tipo: 'borrar', collection }
  const [modal, setModal] = useState(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [errorForm, setErrorForm] = useState('');
  const [guardando, setGuardando] = useState(false);

  const collections = data?.collections || [];

  function abrir(nuevo) {
    setModal(nuevo);
    setNombre(nuevo.collection?.name || '');
    setDescripcion(nuevo.collection?.description || '');
    setErrorForm('');
  }

  function cerrar() {
    if (!guardando) setModal(null);
  }

  async function guardar(event) {
    event.preventDefault();
    const limpio = nombre.trim();
    if (limpio.length < 1 || limpio.length > 80) {
      setErrorForm('El nombre debe tener entre 1 y 80 caracteres');
      return;
    }
    if (descripcion.length > 300) {
      setErrorForm('La descripción no puede superar los 300 caracteres');
      return;
    }
    setGuardando(true);
    setErrorForm('');
    try {
      const body = { name: limpio, description: descripcion.trim() || undefined };
      if (modal.tipo === 'crear') {
        const creada = await collectionsService.createCollection(body);
        setData({ collections: [creada, ...collections] });
      } else {
        const editada = await collectionsService.updateCollection(modal.collection.id, body);
        setData({
          collections: collections.map((c) => (c.id === editada.id ? { ...c, ...editada, itemCount: c.itemCount } : c)),
        });
      }
      setModal(null);
    } catch (err) {
      setErrorForm(err.message); // ej. 409 nombre repetido
    } finally {
      setGuardando(false);
    }
  }

  async function borrar() {
    setGuardando(true);
    setErrorForm('');
    try {
      await collectionsService.deleteCollection(modal.collection.id);
      setData({ collections: collections.filter((c) => c.id !== modal.collection.id) });
      setModal(null);
    } catch (err) {
      setErrorForm(err.message);
    } finally {
      setGuardando(false);
    }
  }

  if (loading) return <Spinner label="Cargando playlists..." />;

  return (
    <section className="collections">
      <header className="page__header">
        <h1 className="page__title">Mis playlists</h1>
        {!error && <Button onClick={() => abrir({ tipo: 'crear' })}>Nueva playlist</Button>}
      </header>

      {error ? (
        <ErrorMessage message={error} onRetry={reload} />
      ) : collections.length === 0 ? (
        <EmptyState
          title="Todavía no tenés playlists"
          message="Creá la primera para empezar a organizar tu música."
          action={<Button onClick={() => abrir({ tipo: 'crear' })}>Crear playlist</Button>}
        />
      ) : (
        <div className="card-grid">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              onRename={(c) => abrir({ tipo: 'renombrar', collection: c })}
              onDelete={(c) => abrir({ tipo: 'borrar', collection: c })}
            />
          ))}
        </div>
      )}

      <Modal
        open={modal?.tipo === 'crear' || modal?.tipo === 'renombrar'}
        onClose={cerrar}
        title={modal?.tipo === 'crear' ? 'Nueva playlist' : 'Renombrar playlist'}
      >
        <form className="form-stack" onSubmit={guardar} noValidate>
          <Input
            label="Nombre"
            value={nombre}
            maxLength={80}
            autoFocus
            onChange={(event) => setNombre(event.target.value)}
          />
          <Input
            label="Descripción (opcional)"
            value={descripcion}
            maxLength={300}
            onChange={(event) => setDescripcion(event.target.value)}
          />
          <ErrorMessage message={errorForm} />
          <Button type="submit" loading={guardando}>
            {modal?.tipo === 'crear' ? 'Crear' : 'Guardar'}
          </Button>
        </form>
      </Modal>

      <Modal open={modal?.tipo === 'borrar'} onClose={cerrar} title="Borrar playlist">
        <p>
          ¿Seguro que querés borrar <strong>{modal?.collection?.name}</strong>? Esta acción no se puede deshacer.
        </p>
        <ErrorMessage message={errorForm} />
        <div className="review-form__actions">
          <Button variant="danger" onClick={borrar} loading={guardando}>
            Borrar
          </Button>
          <Button variant="ghost" onClick={cerrar} disabled={guardando}>
            Cancelar
          </Button>
        </div>
      </Modal>
    </section>
  );
}
