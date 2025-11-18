import { Link } from 'react-router-dom';

interface BaseErrorProps {
  title: string;
  subtitle: string;
  code: number;
  description: string;
  onRetry?: (() => void) | boolean;
  showHome?: boolean;
  children?: React.ReactNode;
}

export default function BaseError({
  title,
  code,
  description,
  onRetry = true,
  showHome = true,
  children
}: BaseErrorProps) {
  const handleRetry = () => {
    if (typeof onRetry === 'function') {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="bg-blue-50 min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-4xl text-blue-600 font-bold">{code}</span>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-500 mb-8">{description}</p>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {onRetry && (
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Intentar de nuevo
              </button>
            )}
            
            {showHome && (
              <Link
                to="/"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Ir al Inicio
              </Link>
            )}
          </div>

          {/* Contenido adicional */}
          {children && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              {children}
            </div>
          )}
        </div>

        {/* Enlace de soporte */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            ¿Necesitas ayuda?{' '}
            <a href="mailto:soporte@eduzas.com" className="text-blue-600 hover:underline">
              Contactar soporte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
