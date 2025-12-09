import BaseError from './BaseError';

interface ForbiddenProps {
  message?: string;
  onClear?: () => void;
  showHome?: boolean;
}

/**
 * Componente de error para respuestas 403 (Forbidden).
 * Indica que el usuario está autenticado pero no tiene permisos para acceder al recurso.
 */
export function Forbidden({
  message = "No tienes permisos para acceder a esta página.",
  onClear,
  showHome = true
}: ForbiddenProps) {
  return (
    <BaseError
      title="Acceso Denegado"
      subtitle="403 - Prohibido"
      code={403}
      description={message}
      onRetry={onClear}
      showHome={showHome}
    >
      <div className="text-sm text-gray-600">
        <p>Si crees que esto es un error, contacta al administrador del sistema.</p>
      </div>
    </BaseError>
  );
}
