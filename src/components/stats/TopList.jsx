// Ranking numerado (top artistas, top canciones, top géneros). Se usa en Stats.
// Props: title, items ([{ id, name, value }]), renderValue(valor) opcional
export default function TopList({ title, items = [], renderValue }) {
  return (
    <section className="top-list">
      <h3 className="top-list__title">{title}</h3>
      <ol className="top-list__items">
        {items.map((item, index) => (
          <li key={item.id ?? index} className="top-list__item">
            <span>{index + 1}.</span> <span>{item.name}</span>{' '}
            <span>{renderValue ? renderValue(item.value) : item.value}</span>
          </li>
        ))}
      </ol>
      {/* TODO: portada de cada ítem y link a su detalle */}
    </section>
  );
}
