import {
  Err,
  InternalServerError,
  Ok,
  type APIResultError,
  type FetchErrorMode,
  type Result,
} from "@application";
import { apiErrorHandlers } from "./api.error.handlers";
import type { APIInputError } from "@application";

/**
 * URL base de la API.
 * @internal
 */
const API_BASE_URL = "http://localhost:5018";

export function baseFetch<T>(
  endpoint: string,
  options?: RequestInit,
  mode?: "strict",
): Promise<T>;
export function baseFetch<T>(
  endpoint: string,
  options: RequestInit,
  mode: "input" | "auth" | "input-auth",
): Promise<Result<T, APIResultError>>;

/**
 * Implementación de la función `baseFetch`.
 */
export async function baseFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  mode: FetchErrorMode = "strict",
): Promise<T | Result<T, APIResultError>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const res = await fetch(url, {
    ...options,
    headers: defaultHeaders,
    credentials: "include",
  });

  if (!res.ok) {
    const shouldReturnResultForInput =
      (mode === "input" || mode === "input-auth") &&
      (res.status === 400 || res.status === 409);

    const shouldReturnResultForAuth =
      (mode === "auth" || mode === "input-auth") && res.status === 401;

    // Si el modo no es estricto y el error es uno de los que se deben manejar,
    // se devuelve un Result en lugar de lanzar una excepción.
    if (shouldReturnResultForInput) {
      const error = (await apiErrorHandlers[res.status](
        res,
        false,
      )) as APIInputError;
      return Err(error);
    }

    if (shouldReturnResultForAuth) {
      return Err({ type: "unauthorized" });
    }

    // Para todos los demás casos, se lanza una excepción.
    const errorHandler =
      apiErrorHandlers[res.status] ??
      (() => {
        throw new InternalServerError(`Unhandled status code: ${res.status}`);
      });
    await errorHandler(res, true); // Lanza la excepción
  }

  const data: T = res.status === 204 ? ({} as T) : await res.json();

  // Para los modos que no son 'strict', envolvemos la respuesta en Ok.
  if (mode !== "strict") {
    return Ok(data);
  }

  return data;
}
