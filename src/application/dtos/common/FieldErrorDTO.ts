/**
 * Representa un error de validación asociado a un campo específico.
 *
 * @remarks
 * Este DTO se utiliza para transportar información de errores de validación
 * en operaciones de entrada de datos.
 */
export type FieldErrorDTO = {
  /** Nombre del campo donde ocurrió el error */
  field: string;
  /** Mensaje descriptivo del error */
  message: string;
};
