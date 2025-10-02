import { Link } from "react-router-dom";

export function ServerErrorPage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100 px-4">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <div className="w-8 h-8 bg-red-600 transform rotate-45 relative">
          <div className="w-2 h-2 bg-red-100 rounded-full absolute top-1 left-3"></div>
          <div className="w-2 h-6 bg-red-100 rounded-sm absolute top-4 left-3"></div>
        </div>
      </div>

      <h1 className="text-6xl font-bold text-gray-800 mb-4">500</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Error del Servidor
      </h2>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        Algo salió mal. Por favor, intenta nuevamente en unos momentos.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
        >
          Reintentar
        </button>
        <Link
          to="/"
          className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 transition-colors"
        >
          Ir al Inicio
        </Link>
      </div>
    </div>
  );
}
