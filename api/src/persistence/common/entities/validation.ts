import { FieldError } from "./field.error";

/**
 * Representa el resultado de una validación de un valor `unknown` hacia un tipo específico.
 *
 * - Si la validación tiene éxito (`success: true`), se expone el valor ya refinado como `T`.
 * - Si la validación falla (`success: false`), se devuelve un error de tipo `E`
 *   que describe el motivo de la invalidación.
 *
 * Este patrón está orientado a validaciones de **tipos desconocidos (`unknown`)**,
 * permitiendo refinar su tipo cuando los datos cumplen las reglas de validación.
 *
 * @typeParam T - Tipo esperado al que se valida y refina el valor.
 * @typeParam E - Tipo de error retornado en caso de validación fallida.
 */
type TypeValidation<T, E> =
  | { success: true; value: T }
  | { success: false; error: E };

/**
 * Validación aplicada a un objeto completo.
 *
 * - Éxito: devuelve un objeto `T` validado.
 * - Error: devuelve un arreglo de `FieldError` con los errores encontrados
 *   en las propiedades del objeto.
 */
export type ObjectTypeValidation<T> = TypeValidation<T, FieldError[]>;

/**
 * Validación aplicada a un único campo.
 *
 * - Éxito: devuelve el valor del campo `T` validado.
 * - Error: devuelve un `FieldError` asociado a ese campo específico.
 */
export type FieldTypeValidation<T> = TypeValidation<T, FieldError>;
