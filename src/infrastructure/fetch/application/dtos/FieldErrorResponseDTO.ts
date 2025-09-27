import type { FieldErrorDTO } from "@application";

/**
 * Representa la respuesta estándar de error de la API cuando
 * ocurren errores de validación en los campos de una solicitud.
 *
 * @property message - Mensaje general de error.
 * @property errors - Lista de errores específicos asociados a cada campo.
 */
export type FieldErrorResponseDTO = {
  /** Mensaje de error */
  message: string;
  /** Errores en campos */
  errors: FieldErrorDTO[];
};
