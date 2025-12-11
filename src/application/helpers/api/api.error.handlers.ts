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
 * Función que transforma una respuesta HTTP de error en una excepción de aplicación (`AppError`).
 * Puede ser síncrona o asíncrona dependiendo de si necesita leer el cuerpo de la respuesta.
 */
type ErrorHandler = (res: Response) => Promise<AppError> | AppError;

/**
 * Registro de manejadores de errores HTTP mapeados por código de estado.
 * Cada manejador construye la excepción `AppError` correspondiente.
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
    const response = (await res.json());
    console.log(response);
    return new Conflict(response.message);
  },
};

