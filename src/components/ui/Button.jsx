// Botón reutilizable. variant: primary | secondary | ghost | danger
import Spinner from './Spinner';

export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  loading = false,
  fullWidth = false,
  disabled = false,
  className = '',
  ...rest
}) {
  const classes = ['btn', `btn--${variant}`, fullWidth && 'btn--full', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} disabled={disabled || loading} {...rest}>
      {loading && <Spinner size="sm" />}
      <span>{children}</span>
    </button>
  );
}
