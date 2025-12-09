/**
 * Modos de manejo de errores para `baseFetch`.
 * - `strict`: Lanza excepciones para cualquier error HTTP.
 * - `input`: Devuelve `Result` para 400/409; lanza excepción para otros.
 * - `auth`: Devuelve `Result` para 401; lanza excepción para otros.
 * - `input-auth`: Combina comportamientos de `input` y `auth`.
 */
export type FetchErrorMode = "strict" | "input" | "auth" | "input-auth";

/** Representa un error de validación asociado a un campo específico. */
export type FieldErrorDTO = {
  /** Nombre del campo afectado. */
  field: string;
  /** Mensaje de error descriptivo. */
  message: string;
};

/** Representa un error de entrada (400/409) devuelto como `Result`. */
export type APIInputError =
  | { type: "conflict"; message: string }
  | { type: "input-error"; data: FieldErrorDTO[] };

/** Representa un error de autenticación (401) devuelto como `Result`. */
export type APIAuthError = { type: "unauthorized" };

/** Unión de errores que pueden ser devueltos en un `Result` por `baseFetch`. */
export type APIResultError = APIInputError | APIAuthError;

/**
 * Clase base para errores de la aplicación.
 * Mantiene la cadena de prototipos para asegurar el funcionamiento de `instanceof`.
 */
export abstract class AppError extends Error {
  protected constructor(message: string, stack?: string) {
    super(message);
    this.name = this.constructor.name;

    if (stack) {
      this.stack = stack;
    }

    // Mantiene la cadena de prototipos para que `instanceof` funcione.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** Error por falta de autenticación (401). */
export class UnauthorizedError extends AppError {
  constructor(message: string = "No autorizado", stack?: string) {
    super(message, stack);
  }
}

/** Error por permisos insuficientes (403). */
export class ForbiddenError extends AppError {
  constructor(message: string = "Acceso denegado", stack?: string) {
    super(message, stack);
  }
}

/** Error por recurso no encontrado (404). */
export class NotFoundError extends AppError {
  constructor(message: string = "Recurso no encontrado", stack?: string) {
    super(message, stack);
  }
}

/** Error por conflicto de estado, ej. duplicados (409). */
export class Conflict extends AppError {
  constructor(message: string, stack?: string) {
    super(message, stack);
  }
}

/** Error por validación de entrada fallida (400). */
export class InputError extends AppError {
  public readonly errors: FieldErrorDTO[];

  constructor(
    errors: FieldErrorDTO[],
    message: string = "Entrada inválida",
    stack?: string,
  ) {
    super(message, stack);
    this.errors = errors;
  }
}

/** Error interno del servidor o inesperado (500). */
export class InternalServerError extends AppError {
  constructor(message: string = "Error interno del servidor", stack?: string) {
    super(message, stack);
  }
}
