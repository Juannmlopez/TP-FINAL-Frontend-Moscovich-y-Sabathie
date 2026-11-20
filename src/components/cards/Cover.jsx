// Portada cuadrada (o redonda) con un ícono de nota si no hay imagen o si falla la carga
import { useState } from 'react';

export default function Cover({ src, alt = '', round = false }) {
  const [fallo, setFallo] = useState(false);
  const clases = `cover ${round ? 'cover--round' : ''}`;

  if (!src || fallo) {
    return (
      <div className={`${clases} cover--empty`} role="img" aria-label={alt}>
        ♪
      </div>
    );
  }

  return <img className={clases} src={src} alt={alt} loading="lazy" onError={() => setFallo(true)} />;
}
