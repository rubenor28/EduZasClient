import { FieldError } from "./field.error";

/**
 * Representa el resultado de una validación de reglas de negocio.
 *
 * - Si `success` es `true`, la validación pasó y no hay errores.
 * - Si `success` es `false`, la validación falló y se proporciona un error
 *   de tipo `E` que describe el motivo del fallo.
 *
 * @typeParam E - Tipo de error retornado en caso de fallo.
 */
type BusinessValidation<E> = 
  | { success: true } 
  | { success: false; error: E };

/**
 * Validación de reglas de negocio aplicada a un objeto completo.
 *
 * - Éxito: `{ success: true }`
 * - Error: `{ success: false; error: FieldError[] }`
 *
 * Permite agrupar múltiples errores de campo dentro de un mismo objeto.
 */
export type ObjectBusinessValidation = BusinessValidation<FieldError[]>;

/**
 * Validación de reglas de negocio aplicada a un único campo.
 *
 * - Éxito: `{ success: true }`
 * - Error: `{ success: false; error: FieldError }`
 *
 * Permite validar individualmente cada campo y reportar errores específicos.
 */
export type FieldBusinessValidation = BusinessValidation<FieldError[]>;
