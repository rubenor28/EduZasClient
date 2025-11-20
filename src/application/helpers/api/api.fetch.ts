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
  AlreadyExistError,
  UnauthorizedError,
} from "@application";
import { apiErrorHandlers } from "./api.error.handlers";

// --- Lógica de baseFetch ---

const API_BASE_URL = "http://localhost:5018";
export type ParseResponse = "json" | "raw" | "void";
export interface FetchOptions extends RequestInit {
  parseResponse?: ParseResponse;
}

// Sobrecargas de baseFetch
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

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...fetchOptions.headers,
  };

  const res = await fetch(url, {
    ...fetchOptions,
    headers: defaultHeaders,
    credentials: "include",
  });

  if (!res.ok) {
    const errorHandler =
      apiErrorHandlers[res.status] ??
      (() => new InternalServerError(`Unhandled status code: ${res.status}`));
    const errorInstance = await errorHandler(res);

    const isInputError =
      errorInstance instanceof InputError ||
      errorInstance instanceof AlreadyExistError;
    const isAuthError = errorInstance instanceof UnauthorizedError;

    const shouldReturnResult =
      (mode === "input" && isInputError) ||
      (mode === "auth" && isAuthError) ||
      (mode === "input-auth" && (isInputError || isAuthError));

    if (shouldReturnResult) {
      let resultError: APIResultError;
      if (errorInstance instanceof InputError) {
        resultError = { type: "input-error", data: errorInstance.errors };
      } else if (errorInstance instanceof AlreadyExistError) {
        resultError = { type: "already-exists" };
      } else {
        // UnauthorizedError
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

type ApiOptions = Omit<FetchOptions, "body" | "method">;

// --- Modo Estricto (Lanza Excepciones) ---

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
  return baseFetch<T>(
    endpoint,
    { ...options, method: "POST", body: JSON.stringify(data) },
    "strict",
  );
}

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
  return baseFetch<T>(
    endpoint,
    { ...options, method: "PUT", body: JSON.stringify(data) },
    "strict",
  );
}

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
  return baseFetch<T, APIInputError>(
    endpoint,
    { ...options, method: "POST", body: JSON.stringify(data) },
    "input",
  );
}

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
  return baseFetch<T, APIInputError>(
    endpoint,
    { ...options, method: "PUT", body: JSON.stringify(data) },
    "input",
  );
}

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