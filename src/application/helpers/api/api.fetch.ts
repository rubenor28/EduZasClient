// Archivo: src/application/helpers/api/api.fetch.ts

import {
  Err,
  InternalServerError,
  Ok,
  type APIResultError,
  type FetchErrorMode,
  type Result,
  type APIInputError,
  type APIAuthError,
  InputError,
  Conflict,
  UnauthorizedError,
} from "@application";
import { apiErrorHandlers } from "./api.error.handlers";

// --- Lógica de baseFetch ---

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5018";

/**
 * Define cómo se debe procesar el cuerpo de una respuesta de la API.
 * @property {'json'} json - Parsea el cuerpo de la respuesta como JSON. Es el valor por defecto.
 * @property {'raw'} raw - Devuelve el objeto `Response` crudo, sin procesar.
 * @property {'void'} void - Ignora el cuerpo de la respuesta. Útil para peticiones donde solo importa el código de estado.
 */
export type ParseResponse = "json" | "raw" | "void";

/**
 * Opciones extendidas para las peticiones fetch, incluyendo `parseResponse`.
 */
export interface FetchOptions extends RequestInit {
  /**
   * Determina cómo se debe procesar el cuerpo de la respuesta.
   * @default 'json'
   */
  parseResponse?: ParseResponse;
}

// Sobrecargas de baseFetch
/**
 * Realiza una petición fetch a la API, gestionando de forma centralizada la URL base,
 * las credenciales, los errores y los modos de respuesta.
 *
 * @internal
 * Esta función no está pensada para ser usada directamente fuera de este módulo.
 * Utilizar las funciones exportadas `apiGet`, `apiPost`, etc. en su lugar.
 *
 * @param endpoint - La ruta del endpoint de la API (ej. `/users/1`).
 * @param options - Opciones de la petición `fetch`, extendidas con `parseResponse`.
 * @param mode - El modo de manejo de errores, que determina si se lanzan excepciones o se devuelve un `Result`.
 * @returns El cuerpo de la respuesta procesado según `parseResponse` y `mode`.
 */
function baseFetch(
  endpoint: string,
  options: FetchOptions & { parseResponse: "void" },
  mode?: "strict",
): Promise<void>;

function baseFetch<TError extends APIResultError>(
  endpoint: string,
  options: FetchOptions & { parseResponse: "void" },
  mode: FetchErrorMode,
): Promise<Result<void, TError>>;

function baseFetch(
  endpoint: string,
  options: FetchOptions & { parseResponse: "raw" },
  mode?: "strict",
): Promise<Response>;

function baseFetch<TError extends APIResultError>(
  endpoint: string,
  options: FetchOptions & { parseResponse: "raw" },
  mode: FetchErrorMode,
): Promise<Result<Response, TError>>;

function baseFetch<T>(
  endpoint: string,
  options?: FetchOptions,
  mode?: "strict",
): Promise<T>;

function baseFetch<T, TError extends APIResultError>(
  endpoint: string,
  options: FetchOptions,
  mode: FetchErrorMode,
): Promise<Result<T, TError>>;

async function baseFetch<T>(
  endpoint: string,
  options: FetchOptions = {},
  mode: FetchErrorMode = "strict",
): Promise<T | Response | void | Result<T | Response | void, APIResultError>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const { parseResponse = "json", ...fetchOptions } = options;

  const res = await fetch(url, {
    ...fetchOptions,
    credentials: "include",
  });

  if (!res.ok) {
    const errorHandler =
      apiErrorHandlers[res.status] ??
      (() => new InternalServerError(`Unhandled status code: ${res.status}`));
    const errorInstance = await errorHandler(res);

    const isInputError =
      errorInstance instanceof InputError ||
      errorInstance instanceof Conflict;
    const isAuthError = errorInstance instanceof UnauthorizedError;

    const shouldReturnResult =
      (mode === "input" && isInputError) ||
      (mode === "auth" && isAuthError) ||
      (mode === "input-auth" && (isInputError || isAuthError));

    if (shouldReturnResult) {
      let resultError: APIResultError;
      if (errorInstance instanceof InputError) {
        resultError = { type: "input-error", data: errorInstance.errors };
      } else if (errorInstance instanceof Conflict) {
        resultError = { type: "conflict", message: errorInstance.message };
      } else {
        resultError = { type: "unauthorized" };
      }
      return Err(resultError);
    }

    throw errorInstance;
  }

  let data: T | Response | void;
  switch (parseResponse) {
    case "raw":
      data = res;
      break;
    case "void":
      data = undefined;
      break;
    default:
      data = res.status === 204 ? ({} as T) : await res.json();
      break;
  }

  if (mode !== "strict") {
    return Ok(data);
  }
  return data;
}

// --- NUEVAS FUNCIONES EXPORTADAS ---

/**
 * Opciones para las funciones `api*` que excluyen propiedades manejadas internamente.
 * @internal
 */
type ApiOptions = Omit<FetchOptions, "body" | "method">;

// --- Modo Estricto (Lanza Excepciones) ---

/**
 * Realiza una petición GET en modo 'strict'. Lanza una excepción en caso de error HTTP.
 * @param endpoint - La ruta del endpoint de la API.
 * @param options - Opciones para la petición, incluyendo `parseResponse`.
 */
export function apiGet<T>(
  endpoint: string,
  options?: ApiOptions & { parseResponse?: "json" },
): Promise<T>;
export function apiGet(
  endpoint: string,
  options: ApiOptions & { parseResponse: "raw" },
): Promise<Response>;
export function apiGet(
  endpoint: string,
  options: ApiOptions & { parseResponse: "void" },
): Promise<void>;
export function apiGet<T>(
  endpoint: string,
  options?: ApiOptions,
): Promise<T | Response | void> {
  return baseFetch<T>(endpoint, { ...options, method: "GET" }, "strict");
}

/**
 * Realiza una petición POST en modo 'strict'. Soporta tanto JSON como FormData.
 * Lanza una excepción en caso de error HTTP.
 * @param endpoint - La ruta del endpoint de la API.
 * @param data - El cuerpo de la petición. Puede ser un objeto (se serializa a JSON) o FormData.
 * @param options - Opciones para la petición, incluyendo `parseResponse`.
 */
export function apiPost<T>(
  endpoint: string,
  data: unknown,
  options?: ApiOptions & { parseResponse?: "json" },
): Promise<T>;
export function apiPost(
  endpoint: string,
  data: unknown,
  options: ApiOptions & { parseResponse: "raw" },
): Promise<Response>;
export function apiPost(
  endpoint: string,
  data: unknown,
  options: ApiOptions & { parseResponse: "void" },
): Promise<void>;
export function apiPost<T>(
  endpoint: string,
  data: unknown,
  options?: ApiOptions,
): Promise<T | Response | void> {
  const isFormData = data instanceof FormData;
  const headers: HeadersInit = isFormData
    ? {}
    : { "Content-Type": "application/json" };

  return baseFetch<T>(
    endpoint,
    {
      ...options,
      method: "POST",
      headers: { ...headers, ...options?.headers },
      body: isFormData ? data : JSON.stringify(data),
    },
    "strict",
  );
}

/**
 * Realiza una petición PUT en modo 'strict'. Soporta tanto JSON como FormData.
 * Lanza una excepción en caso de error HTTP.
 * @param endpoint - La ruta del endpoint de la API.
 * @param data - El cuerpo de la petición. Puede ser un objeto (se serializa a JSON) o FormData.
 * @param options - Opciones para la petición, incluyendo `parseResponse`.
 */
export function apiPut<T>(
  endpoint: string,
  data: unknown,
  options?: ApiOptions & { parseResponse?: "json" },
): Promise<T>;
export function apiPut(
  endpoint: string,
  data: unknown,
  options: ApiOptions & { parseResponse: "raw" },
): Promise<Response>;
export function apiPut(
  endpoint: string,
  data: unknown,
  options: ApiOptions & { parseResponse: "void" },
): Promise<void>;
export function apiPut<T>(
  endpoint: string,
  data: unknown,
  options?: ApiOptions,
): Promise<T | Response | void> {
  const isFormData = data instanceof FormData;
  const headers: HeadersInit = isFormData
    ? {}
    : { "Content-Type": "application/json" };

  return baseFetch<T>(
    endpoint,
    {
      ...options,
      method: "PUT",
      headers: { ...headers, ...options?.headers },
      body: isFormData ? data : JSON.stringify(data),
    },
    "strict",
  );
}

/**
 * Realiza una petición DELETE en modo 'strict'. Lanza una excepción en caso de error HTTP.
 * @param endpoint - La ruta del endpoint de la API.
 * @param options - Opciones para la petición, incluyendo `parseResponse`.
 */
export function apiDelete<T>(
  endpoint: string,
  options?: ApiOptions & { parseResponse?: "json" },
): Promise<T>;
export function apiDelete(
  endpoint: string,
  options: ApiOptions & { parseResponse: "raw" },
): Promise<Response>;
export function apiDelete(
  endpoint: string,
  options: ApiOptions & { parseResponse: "void" },
): Promise<void>;
export function apiDelete<T>(
  endpoint: string,
  options?: ApiOptions,
): Promise<T | Response | void> {
  return baseFetch<T>(endpoint, { ...options, method: "DELETE" }, "strict");
}

// --- Modo Input (Devuelve Result para 400/409) ---

/**
 * Realiza una petición GET en modo 'input'. Devuelve un `Result` en caso de error 400 o 409.
 * @param endpoint - La ruta del endpoint de la API.
 * @param options - Opciones para la petición, incluyendo `parseResponse`.
 */
export function apiGetInput<T>(
  endpoint: string,
  options?: ApiOptions & { parseResponse?: "json" },
): Promise<Result<T, APIInputError>>;
export function apiGetInput(
  endpoint: string,
  options: ApiOptions & { parseResponse: "raw" },
): Promise<Result<Response, APIInputError>>;
export function apiGetInput(
  endpoint: string,
  options: ApiOptions & { parseResponse: "void" },
): Promise<Result<void, APIInputError>>;
export function apiGetInput<T>(
  endpoint: string,
  options?: ApiOptions,
): Promise<Result<T | Response | void, APIInputError>> {
  return baseFetch<T, APIInputError>(
    endpoint,
    { ...options, method: "GET" },
    "input",
  );
}

/**
 * Realiza una petición POST en modo 'input'. Soporta JSON y FormData.
 * Devuelve un `Result` en caso de error 400 o 409.
 * @param endpoint - La ruta del endpoint de la API.
 * @param data - El cuerpo de la petición. Puede ser un objeto (se serializa a JSON) o FormData.
 * @param options - Opciones para la petición, incluyendo `parseResponse`.
 */
export function apiPostInput<T>(
  endpoint: string,
  data: unknown,
  options?: ApiOptions & { parseResponse?: "json" },
): Promise<Result<T, APIInputError>>;
export function apiPostInput(
  endpoint: string,
  data: unknown,
  options: ApiOptions & { parseResponse: "raw" },
): Promise<Result<Response, APIInputError>>;
export function apiPostInput(
  endpoint: string,
  data: unknown,
  options: ApiOptions & { parseResponse: "void" },
): Promise<Result<void, APIInputError>>;
export function apiPostInput<T>(
  endpoint: string,
  data: unknown,
  options?: ApiOptions,
): Promise<Result<T | Response | void, APIInputError>> {
  const isFormData = data instanceof FormData;
  const headers: HeadersInit = isFormData
    ? {}
    : { "Content-Type": "application/json" };

  return baseFetch<T, APIInputError>(
    endpoint,
    {
      ...options,
      method: "POST",
      headers: { ...headers, ...options?.headers },
      body: isFormData ? data : JSON.stringify(data),
    },
    "input",
  );
}

/**
 * Realiza una petición PUT en modo 'input'. Soporta JSON y FormData.
 * Devuelve un `Result` en caso de error 400 o 409.
 * @param endpoint - La ruta del endpoint de la API.
 * @param data - El cuerpo de la petición. Puede ser un objeto (se serializa a JSON) o FormData.
 * @param options - Opciones para la petición, incluyendo `parseResponse`.
 */
export function apiPutInput<T>(
  endpoint: string,
  data: unknown,
  options?: ApiOptions & { parseResponse?: "json" },
): Promise<Result<T, APIInputError>>;
export function apiPutInput(
  endpoint: string,
  data: unknown,
  options: ApiOptions & { parseResponse: "raw" },
): Promise<Result<Response, APIInputError>>;
export function apiPutInput(
  endpoint: string,
  data: unknown,
  options: ApiOptions & { parseResponse: "void" },
): Promise<Result<void, APIInputError>>;
export function apiPutInput<T>(
  endpoint: string,
  data: unknown,
  options?: ApiOptions,
): Promise<Result<T | Response | void, APIInputError>> {
  const isFormData = data instanceof FormData;
  const headers: HeadersInit = isFormData
    ? {}
    : { "Content-Type": "application/json" };

  return baseFetch<T, APIInputError>(
    endpoint,
    {
      ...options,
      method: "PUT",
      headers: { ...headers, ...options?.headers },
      body: isFormData ? data : JSON.stringify(data),
    },
    "input",
  );
}

/**
 * Realiza una petición DELETE en modo 'input'. Devuelve un `Result` en caso de error 400 o 409.
 * @param endpoint - La ruta del endpoint de la API.
 * @param options - Opciones para la petición, incluyendo `parseResponse`.
 */
export function apiDeleteInput<T>(
  endpoint: string,
  options?: ApiOptions & { parseResponse?: "json" },
): Promise<Result<T, APIInputError>>;
export function apiDeleteInput(
  endpoint: string,
  options: ApiOptions & { parseResponse: "raw" },
): Promise<Result<Response, APIInputError>>;
export function apiDeleteInput(
  endpoint: string,
  options: ApiOptions & { parseResponse: "void" },
): Promise<Result<void, APIInputError>>;
export function apiDeleteInput<T>(
  endpoint: string,
  options?: ApiOptions,
): Promise<Result<T | Response | void, APIInputError>> {
  return baseFetch<T, APIInputError>(
    endpoint,
    { ...options, method: "DELETE" },
    "input",
  );
}

// --- Modo Auth (Devuelve Result para 401) ---

/**
 * Realiza una petición GET en modo 'auth'. Devuelve un `Result` en caso de error 401.
 * @param endpoint - La ruta del endpoint de la API.
 * @param options - Opciones para la petición, incluyendo `parseResponse`.
 */
export function apiGetAuth<T>(
  endpoint: string,
  options?: ApiOptions & { parseResponse?: "json" },
): Promise<Result<T, APIAuthError>>;
export function apiGetAuth(
  endpoint: string,
  options: ApiOptions & { parseResponse: "raw" },
): Promise<Result<Response, APIAuthError>>;
export function apiGetAuth(
  endpoint: string,
  options: ApiOptions & { parseResponse: "void" },
): Promise<Result<void, APIAuthError>>;
export function apiGetAuth<T>(
  endpoint: string,
  options?: ApiOptions,
): Promise<Result<T | Response | void, APIAuthError>> {
  return baseFetch<T, APIAuthError>(
    endpoint,
    { ...options, method: "GET" },
    "auth",
  );
}
