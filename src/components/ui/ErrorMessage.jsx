// Caja de error. Si se pasa onRetry muestra un botón para reintentar
export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="error-message" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="error-message__retry" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  );
}
