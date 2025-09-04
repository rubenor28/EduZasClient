import {
  FieldTypeValidation,
  ObjectTypeValidation,
} from "persistence/common/entities";

/**
 * Interfaz para validadores de objetos completos.
 *
 * Un `ObjectTypeValidator` recibe un valor `unknown`, valida que cumpla con la forma
 * y reglas de un objeto `T`, y devuelve un `ObjectTypeValidation<T>`:
 *
 * - En caso de éxito (`success: true`), expone el objeto ya refinado como `T`.
 * - En caso de error (`success: false`), devuelve un arreglo de `FieldError[]`
 *   que describe los problemas encontrados en las propiedades del objeto.
 *
 * @typeParam T - Tipo de objeto esperado tras la validación.
 */
export interface ObjectTypeValidator<T> {
  validate(input: unknown): ObjectTypeValidation<T>;
}

/**
 * Interfaz para validadores de un solo campo.
 *
 * Un `FieldTypeValidator` recibe un valor `unknown`, valida que corresponda
 * al tipo `T` esperado para un campo, y devuelve un `FieldTypeValidation<T>`:
 *
 * - En caso de éxito (`success: true`), expone el valor refinado como `T`.
 * - En caso de error (`success: false`), devuelve un `FieldError`
 *   asociado a ese campo específico.
 *
 * @typeParam T - Tipo de campo esperado tras la validación.
 */
export interface FieldTypeValidator<T> {
  validate(input: unknown): FieldTypeValidation<T>;
}
