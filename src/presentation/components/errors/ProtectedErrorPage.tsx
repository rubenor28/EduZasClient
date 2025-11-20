import {
  isRouteErrorResponse,
  useRouteError,
  useNavigate,
  Navigate,
} from "react-router-dom";
import {
  AppError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "@application";

import { Forbidden } from "./Forbidden";
import { InternalServerError as InternalServer } from "./InternalServerError";
import { NotFound } from "./NotFound";

/**
 * Una página de error diseñada para usarse en el `errorElement` de las rutas
 * protegidas de React Router.
 *
 * Captura y muestra errores de renderizado, loaders y actions. Cuando el error
 * es de tipo `UnauthorizedError` (401), redirige automáticamente a la página
 * de login.
 */
export function ProtectedErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  const handleClearError = () => {
    // Navega a la página de inicio para "resetear" el estado de error.
    navigate("/");
  };

  // --- Caso 1: Errores específicos de nuestra aplicación ---
  if (error instanceof AppError) {
    // Un 401 en una ruta protegida siempre redirige al login.
    if (error instanceof UnauthorizedError)
      return <Navigate to="/login" replace />;

    if (error instanceof ForbiddenError)
      return <Forbidden onClear={handleClearError} />;

    if (error instanceof NotFoundError) return <NotFound />;

    // Cualquier otro AppError se trata como un error interno.
    return (
      <InternalServer
        error={error}
        onClear={handleClearError}
        showDetails={true}
      />
    );
  }

  // --- Caso 2: Errores de respuesta de React Router (ej. 404 de un loader) ---
  if (isRouteErrorResponse(error)) {
    // Un 401 en una ruta protegida siempre redirige al login.
    if (error.status === 401) return <Navigate to="/login" replace />;
    if (error.status === 404) return <NotFound />;
    if (error.status === 403) return <Forbidden onClear={handleClearError} />;

    return (
      <InternalServer
        error={new Error(error.data || error.statusText)}
        onClear={handleClearError}
        showDetails={true}
      />
    );
  }

  // --- Caso 3: Errores nativos de JS (Error, TypeError, etc.) ---
  if (error instanceof Error) {
    return (
      <InternalServer
        error={error}
        onClear={handleClearError}
        showDetails={true}
      />
    );
  }

  // --- Caso 4: Error desconocido ---
  return (
    <InternalServer
      error={new Error(String(error))}
      onClear={handleClearError}
      showDetails={true}
    />
  );
}
