// Ranking numerado (top artistas, top canciones, top géneros). Se usa en Stats.
// Props: title, items ([{ id, name, subtitle, coverUrl, value }]), renderValue(valor) opcional
import Cover from '../cards/Cover';

export default function TopList({ title, items = [], renderValue }) {
  return (
    <section className="top-list">
      <h3 className="top-list__title">{title}</h3>
      {items.length === 0 ? (
        <p className="field__hint">Todavía no hay datos.</p>
      ) : (
        <ol className="top-list__items">
          {items.map((item, index) => (
            <li key={item.id ?? item.name} className="top-list__item">
              <span className="top-list__pos">{index + 1}</span>
              {'coverUrl' in item && (
                <span className="top-list__cover">
                  <Cover src={item.coverUrl} alt="" />
                </span>
              )}
              <span className="top-list__name">
                <span>{item.name}</span>
                {item.subtitle && <span className="field__hint">{item.subtitle}</span>}
              </span>
              <span className="top-list__value">{renderValue ? renderValue(item.value) : item.value}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
