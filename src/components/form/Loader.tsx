/**
 * Loader Component
 *
 * A reusable loading spinner for form submission states.
 *
 * @example
 * // Basic usage
 * {isSubmitting && <Loader />}
 *
 * @example
 * // With custom message
 * {isSubmitting && <Loader message="Enviando formulario..." />}
 *
 * @example
 * // With custom size and color
 * <Loader size={60} color="#005953" />
 *
 * @example
 * // Centered in a container
 * <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
 *   <Loader message="Cargando..." />
 * </div>
 */

export interface LoaderProps {
  /** Optional message to display below the loader */
  message?: string;
  /** Size of the loader in pixels (default: 50) */
  size?: number;
  /** Color of the loader (default: CSS variable --color-primary) */
  color?: string;
  /** Additional CSS class name */
  className?: string;
}

export const Loader = ({
  message,
  size = 50,
  color,
  className = '',
}: LoaderProps) => {
  return (
    <div className={`loader-container ${className}`}>
      <div
        className="loader"
        style={{
          width: `${size}px`,
          ...(color && { borderColor: `${color} transparent` }),
        }}
        role="status"
        aria-live="polite"
        aria-label={message || 'Loading'}
      />
      {message && <p className="loader-message">{message}</p>}
    </div>
  );
};
