import { useState } from "react";
import { UnauthorizedError, ForbiddenError } from "@application";

// Un componente que lanza un error cuando se renderiza.
const CrashingComponent = () => {
  throw new Error("Este componente ha crasheado durante el renderizado.");
};

export const Home = () => {
  const [errorToThrow, setErrorToThrow] = useState<Error | null>(null);
  const [showCrashingComponent, setShowCrashingComponent] = useState(false);

  // Si el estado contiene un error, lánzalo para que el ErrorBoundary lo capture.
  if (errorToThrow) {
    throw errorToThrow;
  }

  // Si se debe mostrar el componente que crashea, renderízalo.
  if (showCrashingComponent) {
    return <CrashingComponent />;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Página de Inicio Segura</h1>
      <p>Esta es la página principal de la aplicación. Estás autenticado.</p>
      
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setErrorToThrow(new UnauthorizedError("Sesión inválida desde Home."))}
          style={{ padding: '0.5rem 1rem', border: '1px solid #ccc' }}
        >
          Lanzar Error 401 (Unauthorized)
        </button>
        <button 
          onClick={() => setErrorToThrow(new ForbiddenError("No tienes permiso desde Home."))}
          style={{ padding: '0.5rem 1rem', border: '1px solid #ccc' }}
        >
          Lanzar Error 403 (Forbidden)
        </button>
        <button 
          onClick={() => setErrorToThrow(new Error("Error genérico desde Home."))}
          style={{ padding: '0.5rem 1rem', border: '1px solid #ccc' }}
        >
          Lanzar Error 500 (Genérico)
        </button>
        <button 
          onClick={() => setShowCrashingComponent(true)}
          style={{ padding: '0.5rem 1rem', border: '1px solid #ccc' }}
        >
          Renderizar Componente que Falla
        </button>
      </div>
       <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#555' }}>
        Haz clic en los botones para probar el `ProtectedErrorPage` que configuramos. Cada botón simula un tipo diferente de error.
        <br />
        El botón de <strong>Error 401</strong> te redirigirá a la página de login. Los otros mostrarán una página de error en el contexto actual.
      </p>
    </div>
  );
};
