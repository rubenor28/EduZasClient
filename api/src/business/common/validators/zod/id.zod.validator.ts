import z from "zod";
import { FieldTypeValidator } from "../type.validator";

/**
 * Validador de identificadores numéricos basado en Zod.
 *
 * Este validador implementa la interfaz `FieldTypeValidator<number>` para
 * comprobar que un valor `unknown` corresponde a un número entero positivo.
 *
 * - Si la validación falla:
 *   - Devuelve `{ success: false, error }`, donde el error describe que
 *     el campo `"id"` no cumple las reglas establecidas.
 * - Si la validación es exitosa:
 *   - Devuelve `{ success: true, value }`, donde `value` es el número entero positivo
 *     refinado y listo para usar como un identificador seguro.
 *
 * Este validador encapsula la lógica de validación del campo `id`, garantizando
 * consistencia en el manejo de errores y en el refinamiento de tipos.
 */
export const idZodValidator: FieldTypeValidator<number> = {
  validate(input) {
    const validation = uIntSchema.safeParse(input);

    if (!validation.success) {
      return {
        success: false,
        error: {
          field: "id",
          message: "El valor debe ser un entero positivo",
        },
      };
    }

    return {
      success: true,
      value: validation.data,
    };
  },
};

/**
 * Esquema Zod para validar un número entero positivo.
 *
 * Reglas:
 * - Debe ser un número (`z.number()`).
 * - Debe ser un entero (`.int()`).
 * - Debe ser mayor que cero (`.positive()`).
 */
const uIntSchema = z.number().int().positive();
