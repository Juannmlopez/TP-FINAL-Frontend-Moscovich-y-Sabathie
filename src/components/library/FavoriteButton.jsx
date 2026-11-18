// Botón de favorito (corazón). No llama a la API: avisa con onToggle y la página
// usa libraryService.updateItem(contentId, { isFavorite }).
// Props: active, onToggle(nuevoValor), disabled
export default function FavoriteButton({ active = false, onToggle, disabled = false }) {
  return (
    <button
      type="button"
      className={`favorite-button ${active ? 'favorite-button--active' : ''}`}
      onClick={() => onToggle?.(!active)}
      disabled={disabled}
      aria-pressed={active}
      aria-label={active ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      {/* TODO: reemplazar por el ícono del Figma */}
      {active ? '♥' : '♡'}
    </button>
  );
}
