import {
  AlreadyExistError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InputError,
  type FieldErrorDTO,
  type APIInputError,
} from "@application";

/**
 * Define la firma para una función manejadora de errores de API.
 *
 * @param res - El objeto `Response` de la petición fetch.
 * @param throwAll - Un booleano que determina el comportamiento del manejador:
 *   - `true`: La función debe lanzar una excepción (ej. `InputError`, `AlreadyExistError`).
 *   - `false`: La función debe devolver un objeto `APIInputError` para ser encapsulado en un `Result.Err`.
 * @returns Una promesa que resuelve a un objeto `APIInputError` si `throwAll` es `false`.
 * Si `throwAll` es `true`, la función lanza una excepción y el tipo de retorno es `never`.
 */
type ErrorHandler = (
  res: Response,
  throwAll: boolean,
) => Promise<APIInputError>;

/**
 * Un registro (`Record`) que mapea códigos de estado HTTP a sus correspondientes
 * funciones `ErrorHandler`.
 *
 * Este enfoque permite una gestión centralizada y extensible de los errores de la API.
 *
 * @property {ErrorHandler} 401 - Lanza siempre `UnauthorizedError`, independientemente de `throwAll`.
 * @property {ErrorHandler} 403 - Lanza siempre `ForbiddenError`, independientemente de `throwAll`.
 * @property {ErrorHandler} 404 - Lanza siempre `NotFoundError`, independientemente de `throwAll`.
 * @property {ErrorHandler} 400 - Si `throwAll` es `true`, lanza `InputError`. Si es `false`,
 * devuelve un objeto `APIInputError` de tipo `input-error` con los detalles de los campos.
 * @property {ErrorHandler} 409 - Si `throwAll` es `true`, lanza `AlreadyExistError`. Si es `false`,
 * devuelve un objeto `APIInputError` de tipo `already-exists`.
 */
export const apiErrorHandlers: Record<number, ErrorHandler> = {
  401: () => {
    throw new UnauthorizedError();
  },
  403: () => {
    throw new ForbiddenError();
  },
  404: () => {
    throw new NotFoundError();
  },
  400: async (res, throwAll) => {
    const errors: FieldErrorDTO[] = (await res.json()).errors;

    if (throwAll) throw new InputError(errors);

    return {
      type: "input-error",
      data: errors,
    };
  },
  409: async (_: Response, throwAll: boolean) => {
    if (throwAll) throw new AlreadyExistError();

    return { type: "already-exists" };
  },
};
