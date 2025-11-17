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
  subtitle,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Código de error */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-900 opacity-10">{code}</h1>
        </div>

        {/* Icono e información */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <h3 className="text-lg text-gray-600 mb-4">{subtitle}</h3>
          <p className="text-gray-500 mb-8">{description}</p>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onRetry && (
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Intentar de nuevo
              </button>
            )}
            
            {showHome && (
              <Link
                to="/"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Ir al Inicio
              </Link>
            )}
          </div>

          {/* Contenido adicional */}
          {children && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              {children}
            </div>
          )}
        </div>

        {/* Enlace de soporte */}
        <div className="mt-6">
          <p className="text-sm text-gray-500">
            ¿Necesitas ayuda?{' '}
            <a href="mailto:soporte@miapp.com" className="text-blue-600 hover:text-blue-700">
              Contactar soporte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
