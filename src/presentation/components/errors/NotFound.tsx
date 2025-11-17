import BaseError from './BaseError';
import { useLocation, Link } from 'react-router-dom';

interface NotFoundErrorProps {
  resource?: string;
  showRetry?: boolean;
}

export function NotFound({ 
  resource = "página",
  showRetry = false 
}: NotFoundErrorProps) {
  const location = useLocation();
  
  return (
    <BaseError
      title="Página No Encontrada"
      subtitle="404 - No encontrado"
      code={404}
      description={`La ${resource} que estás buscando no existe o ha sido movida.`}
      showRetry={showRetry}
      showHome={true}
    >
      <div className="text-sm text-gray-600 space-y-2">
        <p>URL solicitada: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{location.pathname}</code></p>
        
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Ir al Inicio
          </Link>
          <button
            onClick={() => window.history.back()}
            className="text-gray-600 hover:text-gray-700 text-sm font-medium"
          >
            Volver Atrás
          </button>
        </div>
      </div>
    </BaseError>
  );
}
