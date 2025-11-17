import BaseError from './BaseError';

interface ForbiddenProps {
  message?: string;
  onClear?: () => void;
  showHome?: boolean;
}

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
