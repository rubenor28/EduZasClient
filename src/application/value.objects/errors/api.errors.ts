/**
 * Representa un error de validacion en un campo,
 * ya sea de un objeto o una entrada cualquiera.
 */
export type FieldErrorDTO = {
  field: string;
  message: string;
};

/**
 * Representa un posible error de entrada de una llamada
 * a la API.
 */
export type APIInputError =
  | { type: "already-exists" }
  | { type: "input-error"; data: FieldErrorDTO[] };

/**
 * Clase base para todos los errores personalizados de la aplicación.
 * Asegura que la cadena de prototipos se mantenga correctamente y que el
 * stack trace se pueda preservar.
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

/**
 * Representa un  error por falta de autenticacion,
 * como una respuesta 401.
 */
export class UnauthorizedError extends AppError {
  constructor(
    message: string = "No autorizado",
    stack?: string,
  ) {
    super(message, stack);
  }
}

/**
 * Representa un error por falta de permisos,
 * como una respuesta 403.
 */
export class ForbiddenError extends AppError {
  constructor(message: string = "Acceso denegado", stack?: string) {
    super(message, stack);
  }
}

/**
 * Representa un error al no encontrar un recurso,
 * como una respuesta 404.
 */
export class NotFoundError extends AppError {
  constructor(message: string = "Recurso no encontrado", stack?: string) {
    super(message, stack);
  }
}

/**
 * Representa un error al tratar de crear un elemento
 * repetido, como una respuesta 409.
 */
export class AlreadyExistError extends AppError {
  constructor(message: string = "El elemento ya existe", stack?: string) {
    super(message, stack);
  }
}

/**
 * Representa un error de validación de entrada.
 */
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

/**
 * Representa un error interno del servidor o un error no esperado.
 */
export class InternalServerError extends AppError {
  constructor(message: string = "Error interno del servidor", stack?: string) {
    super(message, stack);
  }
}
