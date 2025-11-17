import { useState, useEffect, type ReactNode } from "react";
import { errorService } from "@application";
import { type AppError } from "@application";
import { ErrorView } from "./ErrorView";

interface Props {
  children: ReactNode;
}

/**
 * Un componente que actúa como una barrera de error global.
 * Se suscribe al `errorService` y muestra una vista de error a pantalla completa
 * si se notifica un error global. De lo contrario, renderiza la aplicación.
 */
export function GlobalErrorDisplay({ children }: Props) {
  const [globalError, setGlobalError] = useState<AppError | null>(null);

  useEffect(() => {
    // Nos suscribimos al servicio de errores cuando el componente se monta.
    const unsubscribe = errorService.subscribe(setGlobalError);

    // Nos desuscribimos cuando el componente se desmonta para evitar fugas de memoria.
    return unsubscribe;
  }, []);

  if (globalError) {
    // Si hay un error global, mostramos la vista de error.
    // Pasamos una función para limpiar el error y poder seguir usando la app.
    return <ErrorView error={globalError} onClear={() => errorService.clear()} />;
  }

  // Si no hay error, renderizamos la aplicación normalmente.
  return <>{children}</>;
}
