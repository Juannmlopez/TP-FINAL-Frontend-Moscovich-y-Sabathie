// Indicador de carga. size: sm | md | lg. fullScreen lo centra en toda la pantalla
export default function Spinner({ size = 'md', label, fullScreen = false }) {
  const spinner = (
    <div className="spinner__wrapper" role="status" aria-live="polite">
      <span className={`spinner spinner--${size}`} aria-hidden="true" />
      {label ? <span className="spinner__label">{label}</span> : <span className="sr-only">Cargando</span>}
    </div>
  );

  if (fullScreen) return <div className="spinner__fullscreen">{spinner}</div>;
  return spinner;
}
