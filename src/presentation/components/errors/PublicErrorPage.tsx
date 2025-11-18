import {
  isRouteErrorResponse,
  useRouteError,
  useNavigate,
} from "react-router-dom";
import {
  AppError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "@application";
import { InternalServerError as InternalServer } from "./InternalServerError";
import { NotFound } from "./NotFound";

/**
 * Una página de error diseñada para usarse en el `errorElement` de las rutas
 * públicas de React Router.
 *
 * Su objetivo principal es ocultar los detalles de errores de autenticación
 * o autorización (401, 403), presentándolos como un error 500 genérico.
 * Esto evita dar pistas sobre el estado de autenticación en páginas como
 * el login o el registro.
 */
export function PublicErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  const handleClearError = () => {
    // Navega a la página de inicio para "resetear" el estado de error.
    navigate("/");
  };

  // Transforma errores 401/403 en un InternalServerError para la UI.
  if (
    error instanceof UnauthorizedError ||
    error instanceof ForbiddenError ||
    (isRouteErrorResponse(error) && (error.status === 401 || error.status === 403))
  ) {
    const originalError = error instanceof Error ? error : new Error(String(error));
    return (
      <InternalServer
        error={new InternalServerError("Ha ocurrido un error inesperado.", originalError.stack)}
        onClear={handleClearError}
        showDetails={false} // Oculta los detalles en producción/rutas públicas
      />
    );
  }

  // --- Errores específicos de la aplicación (excluyendo 401/403) ---
  if (error instanceof AppError) {
    if (error instanceof NotFoundError) {
      return <NotFound />;
    }
    return <InternalServer error={error} onClear={handleClearError} showDetails={true} />;
  }

  // --- Errores de respuesta de React Router (ej. 404) ---
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <NotFound />;
    }
    return (
      <InternalServer
        error={new Error(error.data || error.statusText)}
        onClear={handleClearError}
        showDetails={true}
      />
    );
  }

  // --- Errores nativos de JS o desconocidos ---
  const finalError = error instanceof Error ? error : new Error(String(error));
  return <InternalServer error={finalError} onClear={handleClearError} showDetails={true} />;
}
