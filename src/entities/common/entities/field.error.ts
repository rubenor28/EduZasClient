/**
 * Representa un error ocurrido en un campo específico durante
 * un proceso de validación o procesamiento.
 */
export type FieldError = {
  /** Nombre del campo que provocó el error. */
  field: string;
  /** Mensaje descriptivo del error. */
  message: string;
};
