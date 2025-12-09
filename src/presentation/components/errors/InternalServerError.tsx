import BaseError from "./BaseError";
import { useState } from "react";

interface InternalServerErrorProps {
  error?: Error;
  showDetails?: boolean;
  onClear?: () => void;
}

/**
 * Componente de error para respuestas 500 (Internal Server Error) o errores inesperados.
 * Permite mostrar detalles técnicos del error (stack trace) si se habilita `showDetails`.
 */
export function InternalServerError({
  error,
  showDetails = false,
  onClear,
}: InternalServerErrorProps) {
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  return (
    <BaseError
      title="Error del Servidor"
      subtitle="500 - Error interno"
      code={500}
      description="Ha ocurrido un error inesperado en nuestro servidor. Nuestro equipo ha sido notificado y está trabajando en la solución."
      onRetry={onClear}
      showHome={true}
    >
      {/* Detalles del error para desarrollo */}
      {showDetails && error && (
        <div className="text-left">
          <button
            onClick={() => setShowErrorDetails(!showErrorDetails)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium mb-2"
          >
            {showErrorDetails ? "Ocultar" : "Mostrar"} detalles técnicos
          </button>

          {showErrorDetails && (
            <div className="bg-gray-100 rounded-lg p-4 text-xs font-mono overflow-auto max-h-40">
              <div className="text-red-600 font-semibold mb-2">
                {error.name}: {error.message}
              </div>
              <pre className="text-gray-700 whitespace-pre-wrap">
                {error.stack}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Información para el usuario */}
      <div className="text-sm text-gray-600 space-y-2">
        <p className="font-medium">¿Qué puedes hacer?</p>
        <ul className="text-left list-disc list-inside space-y-1">
          <li>Intentar recargar la página</li>
          <li>Volver a la página anterior</li>
          <li>Esperar unos minutos e intentar nuevamente</li>
          <li>Contactar a soporte si el problema persiste</li>
        </ul>
      </div>
    </BaseError>
  );
}
