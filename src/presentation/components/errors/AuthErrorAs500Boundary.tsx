import { useState, useEffect, type ReactNode } from "react";
import {
  errorService,
  type AppError,
  UnauthorizedError,
  ForbiddenError,
  InternalServerError,
} from "@application";
import { ErrorView } from "./ErrorView";

interface Props {
  children: ReactNode;
}

/**
 * Un componente guardián de errores globales que trata los errores de
 * autenticación (401) y autorización (403) como si fueran un error
 * interno del servidor (500).
 *
 * Para todos los demás errores, se comporta igual que GlobalErrorDisplay.
 */
export function AuthErrorAs500Boundary({ children }: Props) {
  const [displayError, setDisplayError] = useState<AppError | null>(null);

  useEffect(() => {
    const handleGlobalError = (error: AppError | null) => {
      if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
        // Transforma el error 401/403 en un 500.
        const newError = new InternalServerError(
          "Ha ocurrido un error inesperado.",
          error.stack, // Conserva el stack original para depuración en consola.
        );
        setDisplayError(newError);
      } else {
        // Para cualquier otro error, lo muestra tal cual.
        setDisplayError(error);
      }
    };

    // Nos suscribimos al servicio de errores con nuestra lógica personalizada.
    const unsubscribe = errorService.subscribe(handleGlobalError);

    // Limpiamos la suscripción al desmontar.
    return unsubscribe;
  }, []);

  if (displayError) {
    // La lógica de renderizado es idéntica a la de GlobalErrorDisplay.
    return (
      <ErrorView error={displayError} onClear={() => errorService.clear()} />
    );
  }

  return <>{children}</>;
}
