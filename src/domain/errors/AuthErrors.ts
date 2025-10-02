/**
 * Enumeración de errores de autenticación y autorización
 * @constant AuthErrors
 */
export const AuthErrors = {
  /** Error cuando el usuario no está autenticado */
  Unauthorized: "unauthorized",
  /** Error cuando el usuario no tiene permisos para la operación */
  Forbidden: "forbidden",
} as const;

/**
 * Tipo que representa los posibles errores de autenticación
 * @type AuthErrors
 */
export type AuthErrors = (typeof AuthErrors)[keyof typeof AuthErrors];
