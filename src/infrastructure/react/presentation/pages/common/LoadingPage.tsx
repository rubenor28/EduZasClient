export function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100 px-4">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Cargando</h1>
      <p className="text-gray-600">Por favor, espera un momento...</p>
    </div>
  );
}
