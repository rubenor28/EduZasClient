import { type Result, type APIInputError } from "@application";
import { baseFetch } from "./api.helper";

/**
 * Objeto `apiClient` que encapsula los métodos HTTP para realizar peticiones a la API.
 *
 * Ofrece dos modos de operación:
 * 1.  **Modo Estricto (métodos directos: `get`, `post`, `put`, `delete`):**
 *     - Lanza excepciones para todos los errores HTTP (4xx, 5xx).
 *     - Ideal para casos donde los errores deben ser capturados por un `ErrorBoundary` o un `try/catch` global.
 *     - El valor de retorno en caso de éxito es directamente el objeto `T` esperado.
 *
 * 2.  **Modo de Manejo Funcional (`inputHandle`):**
 *     - Devuelve un objeto `Result<T, APIInputError>`.
 *     - Para errores `400 Bad Request` y `409 Conflict`, retorna una variante `Err` con un objeto `APIInputError`.
 *     - Para otros errores como `401 Unauthorized`, `403 Forbidden` y `404 Not Found`, lanza una excepción (comportamiento estricto).
 *     - Este modo es útil en formularios o interacciones donde se necesita manejar explícitamente
 *       los errores de validación o conflictos de datos sin detener la ejecución con una excepción,
 *       aprovechando la API funcional de `Result`.
 *
 * @example
 * // Modo Estricto: Lanza una excepción si la petición falla.
 * try {
 *   const user = await apiClient.get<User>('/users/1');
 *   console.log(user);
 * } catch (error) {
 *   // Maneja errores como UnauthorizedError, InputError, etc.
 *   console.error('Fallo al obtener el usuario:', error);
 * }
 *
 * @example
 * // Modo `inputHandle`: Devuelve un `Result` para errores 400/409.
 * const result = await apiClient.inputHandle.post<User>('/users', newUser);
 *
 * result.match(
 *   (user) => console.log('Usuario creado:', user),
 *   (error) => {
 *     if (error.type === 'input-error') {
 *       console.error('Errores de validación:', error.data);
 *     } else if (error.type === 'already-exists') {
 *       console.error('El usuario ya existe.');
 *     }
 *   }
 * );
 */
export const apiClient = {
  // Métodos principales - Comportamiento ESTRICTO por defecto (throwAll = true)
  // Lanzan TODAS las excepciones: 400, 409, 401, 403, 404
  get: <T>(endpoint: string, customHeaders?: HeadersInit): Promise<T> =>
    baseFetch<T>(endpoint, { method: "GET", headers: customHeaders }, true),

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
      true,
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
      true,
    ),

  delete: <T>(endpoint: string, customHeaders?: HeadersInit): Promise<T> =>
    baseFetch<T>(endpoint, { method: "DELETE", headers: customHeaders }, true),

  /**
   * Métodos con manejo específico de errores de input/conflict (throwAll = false)
   * - 400, 409 → Retornan `Err<APIInputError>`
   * - 401, 403, 404 → Lanzan una excepción
   */
  inputHandle: {
    get: <T>(
      endpoint: string,
      customHeaders?: HeadersInit,
    ): Promise<Result<T, APIInputError>> =>
      baseFetch<T>(endpoint, { method: "GET", headers: customHeaders }, false),

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
        false,
      ),

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
        false,
      ),

    delete: <T>(
      endpoint: string,
      customHeaders?: HeadersInit,
    ): Promise<Result<T, APIInputError>> =>
      baseFetch<T>(
        endpoint,
        { method: "DELETE", headers: customHeaders },
        false,
      ),
  },
};
