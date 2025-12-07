import {
  Conflict,
  ForbiddenError,
  InputError,
  NotFoundError,
  UnauthorizedError,
  type AppError,
  type FieldErrorDTO,
} from "@application";

/**
 * @modificado
 * La firma ahora es más simple. Solo convierte una `Response` en una instancia de `AppError`.
 * Es síncrona si no necesita leer el cuerpo, y asíncrona si lo necesita.
 */
type ErrorHandler = (res: Response) => Promise<AppError> | AppError;

/**
 * @modificado
 * El registro de manejadores ahora es más simple. Cada función solo se preocupa
 * de construir y devolver la instancia de error apropiada.
 */
export const apiErrorHandlers: Record<number, ErrorHandler> = {
  401: () => new UnauthorizedError(),
  403: () => new ForbiddenError(),
  404: () => new NotFoundError(),
  400: async (res) => {
    // El manejador siempre asume que necesita parsear el error para construirlo.
    const errors: FieldErrorDTO[] = (await res.json()).errors;
    return new InputError(errors);
  },
  409: async (res) => {
    const response = (await res.json()).errors;
    return new Conflict(response.message);
  },
};

