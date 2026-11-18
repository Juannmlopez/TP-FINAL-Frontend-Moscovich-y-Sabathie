// Tarjeta de un indicador (ej. "Minutos escuchados: 12.340"). Se usa en Stats y Home.
// Props: label, value, hint (texto chico opcional)
export default function StatCard({ label, value, hint }) {
  return (
    <article className="stat-card">
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">{value ?? '-'}</p>
      {hint && <p className="stat-card__hint">{hint}</p>}
      {/* TODO: ícono y estilos según el Figma */}
    </article>
  );
}
