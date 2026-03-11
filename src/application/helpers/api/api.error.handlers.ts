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
 * Cada manejador construye la excepción `AppError` correspondiente, abstrayendo
 * los detalles de la respuesta HTTP del resto de la aplicación.
 */
export const apiErrorHandlers: Record<number, ErrorHandler> = {
  /** Maneja el error 401 (No autorizado). */
  401: () => new UnauthorizedError(),
  /** Maneja el error 403 (Prohibido). */
  403: () => new ForbiddenError(),
  /** Maneja el error 404 (No encontrado). */
  404: () => new NotFoundError(),
  /** Maneja el error 400 (Bad Request), parseando la lista de errores de validación de campos. */
  400: async (res) => {
    const errors: FieldErrorDTO[] = (await res.json()).errors;
    return new InputError(errors);
  },
  /** Maneja el error 409 (Conflicto), recuperando el mensaje descriptivo del conflicto. */
  409: async (res) => {
    const response = (await res.json());
    return new Conflict(response.message);
  },
};

