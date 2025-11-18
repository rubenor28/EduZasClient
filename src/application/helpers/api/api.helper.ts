import {
  Err,
  InternalServerError,
  Ok,
  type APIInputError,
  type Result,
} from "@application";
import { apiErrorHandlers } from "./api.error.handlers";

/**
 * URL base de la API.
 * @internal
 */
const API_BASE_URL = "http://localhost:5018";

/**
 * Realiza una petición a la API y maneja la respuesta en "modo estricto".
 *
 * @remarks
 * En este modo, cualquier respuesta `!res.ok` resultará en una excepción lanzada
 * por el `errorHandler` correspondiente.
 *
 * @template T - El tipo de dato esperado en una respuesta exitosa.
 * @param endpoint - La ruta del endpoint de la API (ej. `/users`).
 * @param options - Opciones de configuración para la petición `fetch`.
 * @param throwAll - Debe ser `true` para activar este modo.
 * @returns Una promesa que resuelve al tipo `T` si la petición es exitosa.
 * @throws {InputError | AlreadyExistError | UnauthorizedError | ForbiddenError | NotFoundError} - En caso de error.
 */
export function baseFetch<T>(
  endpoint: string,
  options: RequestInit,
  throwAll: true,
): Promise<T>;

/**
 * Realiza una petición a la API y maneja la respuesta en "modo funcional".
 *
 * @remarks
 * En este modo, los errores `400` y `409` son capturados y devueltos como
 * una variante `Err<APIInputError>`. Otros errores (401, 403, 404)
 * todavía lanzarán excepciones.
 *
 * @template T - El tipo de dato esperado en una respuesta exitosa.
 * @param endpoint - La ruta del endpoint de la API (ej. `/users`).
 * @param options - Opciones de configuración para la petición `fetch`.
 * @param throwAll - Debe ser `false` para activar este modo.
 * @returns Una promesa que resuelve a un `Result<T, APIInputError>`.
 * @throws {UnauthorizedError | ForbiddenError | NotFoundError} - En caso de errores de autenticación/permisos.
 */
export function baseFetch<T>(
  endpoint: string,
  options: RequestInit,
  throwAll: false,
): Promise<Result<T, APIInputError>>;

/**
 * Realiza una petición a la API y maneja la respuesta. Por defecto, opera en "modo funcional" (`throwAll = false`).
 *
 * @template T - El tipo de dato esperado en una respuesta exitosa.
 * @param endpoint - La ruta del endpoint de la API (ej. `/users`).
 * @param options - Opciones de configuración para la petición `fetch`.
 * @returns Una promesa que resuelve a un `Result<T, APIInputError>`.
 */
export function baseFetch<T>(
  endpoint: string,
  options: RequestInit,
): Promise<Result<T, APIInputError>>;

/**
 * Implementación de la función `baseFetch`.
 * Construye y ejecuta una petición `fetch`, y procesa la respuesta según el modo (`throwAll`).
 *
 * @template T - El tipo de dato esperado en la respuesta.
 * @param endpoint - La ruta del endpoint de la API.
 * @param options - Opciones de `fetch`.
 * @param throwAll - Controla el comportamiento del manejo de errores.
 * @returns Una promesa que resuelve a `T` o a `Result<T, APIInputError>` dependiendo de `throwAll`.
 * @internal
 */
export async function baseFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  throwAll: boolean = false,
): Promise<T | Result<T, APIInputError>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers: defaultHeaders });

  if (!res.ok) {
    const errorHandler =
      apiErrorHandlers[res.status] ??
      (() => {
        throw new InternalServerError(`Unhandled status code: ${res.status}`);
      });

    // Si throwAll es true, el errorHandler lanzará una excepción y la ejecución se detendrá aquí.
    // Si es false, errorHandler devolverá un objeto APIInputError.
    const error = await errorHandler(res, throwAll);

    // Este código solo se alcanza si throwAll es false.
    return Err(error);
  }

  // Si la respuesta no tiene contenido (ej. 204 No Content),
  // no se intenta parsear el JSON.
  if (res.status === 204) {
    const data = {} as T;
    return throwAll ? data : Ok(data);
  }

  const data: T = await res.json();

  // Si throwAll es true, se retorna T directamente.
  // Si es false, se retorna un Ok<T>.
  return throwAll ? data : Ok(data);
}
