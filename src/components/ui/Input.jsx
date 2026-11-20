// Campo de formulario con label y mensaje de error debajo
// hint: texto de ayuda opcional que se muestra debajo cuando no hay error
// adornment: ícono opcional que se muestra dentro del input, a la derecha
import { useId } from 'react';

export default function Input({ label, error, hint, adornment, id, className = '', ...rest }) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  const input = (
    <input
      id={inputId}
      className={`field__input ${error ? 'field__input--error' : ''}`}
      aria-invalid={Boolean(error)}
      aria-describedby={describedBy}
      {...rest}
    />
  );

  return (
    <div className={`field ${className}`}>
      {label && (
        <label className="field__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      {adornment ? (
        <div className="field__control">
          {input}
          <span className="field__adornment" aria-hidden="true">
            {adornment}
          </span>
        </div>
      ) : (
        input
      )}
      {error ? (
        <p id={errorId} className="field__error">
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className="field__hint">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
