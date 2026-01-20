interface WaitingGradeProps {
  title: string;
  description: string;
}

export function WaitingGradeProps() {
  const handleRetry = () => window.location.reload();

  return (
    <div className="bg-blue-50 min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Esperando revisión
          </h2>
          <p className="text-gray-500 mb-8">
            Tu profesor debe revisar tus respuestas
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Refrescar página
              </button>
              <div className="mt-8 pt-6 border-t border-gray-200"></div>
            </div>
          </div>
          <div className="text-sm text-gray-600 mt-8">
            <p>
              Si crees que esto es un error, contacta al administrador del
              sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
