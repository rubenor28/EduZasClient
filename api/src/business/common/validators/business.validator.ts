import { FieldBusinessValidation } from "persistence/common/entities";

/**
 * Define el contrato para validar reglas de negocio sobre un objeto del tipo `T`.
 *
 * A diferencia de los validadores de tipos o DTOs, este validador
 * se enfoca en verificar que se cumplan las **invariantes y reglas del dominio**.
 *
 * @template T - Tipo del objeto que se va a validar.
 */
export interface BusinessValidator<T> {
  /**
   * Evalúa si el objeto cumple con las reglas de negocio definidas.
   *
   * @param input - Objeto del dominio a validar.
   * @returns `true` si cumple con las reglas de negocio, `false` en caso contrario.
   */
  validate(input: T): FieldBusinessValidation;
}
