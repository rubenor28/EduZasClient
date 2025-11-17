import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "@presentation";
import { AppError, errorService, InternalServerError } from "@application";

// --- MANEJO DE ERRORES GLOBALES ---

// Captura errores síncronos no controlados
window.addEventListener("error", (event: ErrorEvent) => {
  const originalError = event.error;

  if (originalError instanceof AppError) {
    // Si ya es un error de nuestra aplicación, lo notificamos directamente.
    errorService.notify(originalError);
  } else {
    // Si es un error genérico, lo envolvemos en un InternalServerError.
    const error = new InternalServerError(
      event.message,
      originalError?.stack ?? "No stack trace available",
    );
    errorService.notify(error);
  }
});

// Captura promesas rechazadas no controladas
window.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
  const reason = event.reason;

  if (reason instanceof AppError) {
    // Si ya es un error de nuestra aplicación, lo notificamos directamente.
    errorService.notify(reason);
  } else if (reason instanceof Error) {
    // Si es un error genérico, lo envolvemos.
    const error = new InternalServerError(reason.message, reason.stack);
    errorService.notify(error);
  } else {
    // Si la promesa fue rechazada con algo que no es un error (ej. un string).
    const error = new InternalServerError(
      "Una promesa fue rechazada sin un error explícito.",
    );
    errorService.notify(error);
  }
});

// --- FIN MANEJO DE ERRORES GLOBALES ---

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
