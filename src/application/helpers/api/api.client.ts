import {
  type Result,
  type APIResultError,
  type APIInputError,
  type APIAuthError,
} from "@application";
import { baseFetch } from "./api.helper";
import type { User } from "@domain";

/**
 * Objeto `apiClient` que encapsula los métodos HTTP para realizar peticiones a la API.
 *
 * Ofrece diferentes "modos" de manejo de errores.
 */
export const apiClient = {
  /**
   * MODO ESTRICTO: Lanza excepciones para cualquier error HTTP (4xx, 5xx).
   */
  get: <T>(endpoint: string, customHeaders?: HeadersInit): Promise<T> =>
    baseFetch<T>(endpoint, { method: "GET", headers: customHeaders }, "strict"),

  post: <T>(
    endpoint: string,
    data: unknown,
    customHeaders?: HeadersInit,
  ): Promise<T> =>
    baseFetch<T>(
      endpoint,
      {
        method: "POST",
        headers: customHeaders,
        body: JSON.stringify(data),
      },
      "strict",
    ),

  put: <T>(
    endpoint: string,
    data: unknown,
    customHeaders?: HeadersInit,
  ): Promise<T> =>
    baseFetch<T>(
      endpoint,
      {
        method: "PUT",
        headers: customHeaders,
        body: JSON.stringify(data),
      },
      "strict",
    ),

  delete: <T>(endpoint: string, customHeaders?: HeadersInit): Promise<T> =>
    baseFetch<T>(
      endpoint,
      { method: "DELETE", headers: customHeaders },
      "strict",
    ),

  /**
   * MODO AUTH: No lanza excepción para errores 401, en su lugar devuelve
   * un `Result` con un `APIAuthError`.
   */
  auth: {
    getMe: (): Promise<Result<User, APIResultError>> =>
      baseFetch<User>(
        "/auth/me",
        { method: "GET" },
        "auth",
      ) as Promise<Result<User, APIAuthError>>,
  },

  /**
   * MODO INPUT: No lanza excepción para errores 400/409, en su lugar
   * devuelve un `Result` con un `APIInputError`.
   */
  inputHandle: {
    get: <T>(
      endpoint: string,
      customHeaders?: HeadersInit,
    ): Promise<Result<T, APIInputError>> =>
      baseFetch<T>(
        endpoint,
        { method: "GET", headers: customHeaders },
        "input",
      ) as Promise<Result<T, APIInputError>>,

    post: <T>(
      endpoint: string,
      data: unknown,
      customHeaders?: HeadersInit,
    ): Promise<Result<T, APIInputError>> =>
      baseFetch<T>(
        endpoint,
        {
          method: "POST",
          headers: customHeaders,
          body: JSON.stringify(data),
        },
        "input",
      ) as Promise<Result<T, APIInputError>>,

    put: <T>(
      endpoint: string,
      data: unknown,
      customHeaders?: HeadersInit,
    ): Promise<Result<T, APIInputError>> =>
      baseFetch<T>(
        endpoint,
        {
          method: "PUT",
          headers: customHeaders,
          body: JSON.stringify(data),
        },
        "input",
      ) as Promise<Result<T, APIInputError>>,

    delete: <T>(
      endpoint: string,
      customHeaders?: HeadersInit,
    ): Promise<Result<T, APIInputError>> =>
      baseFetch<T>(
        endpoint,
        { method: "DELETE", headers: customHeaders },
        "input",
      ) as Promise<Result<T, APIInputError>>,
  },
};
