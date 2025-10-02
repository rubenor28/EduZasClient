import { Link } from "react-router-dom";

export function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100 px-4">
      {/* Ícono de escudo con CSS */}
      <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
        <div className="w-8 h-10 bg-yellow-600 rounded-t-lg relative">
          <div className="w-12 h-2 bg-yellow-600 absolute -bottom-1 -left-2 rounded-sm"></div>
        </div>
      </div>
      
      <h1 className="text-6xl font-bold text-gray-800 mb-4">403</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Acceso Denegado
      </h2>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        No tienes permisos para acceder a esta página. 
        Si crees que esto es un error, contacta al administrador.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          to="/"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
        >
          Volver al Inicio
        </Link>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 transition-colors"
        >
          Regresar
        </button>
      </div>
    </div>
  );
}
