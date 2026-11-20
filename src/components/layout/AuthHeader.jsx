// Encabezado de las pantallas de login y registro: botón "volver" + título centrado
export default function AuthHeader({ title, onBack }) {
  return (
    <header className="auth__header">
      <button type="button" className="auth__back" onClick={onBack} aria-label="Volver">
        ‹
      </button>
      <h1 className="auth__title">{title}</h1>
      <span aria-hidden="true" />
    </header>
  );
}
