// Mensaje para cuando una lista no tiene elementos, con una acción opcional
export default function EmptyState({ title = 'No hay nada para mostrar', message, action }) {
  return (
    <div className="empty-state">
      <h3 className="empty-state__title">{title}</h3>
      {message && <p className="empty-state__message">{message}</p>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}
