import z from "zod"
import { ObjectTypeValidator } from "../type.validator";
import { zodToFieldErrors } from "persistence/common/mappers";
import { BusinessValidator } from "../business.validator";

/**
 * Fábrica que genera un validador a partir de un esquema de Zod.
 *
 * @typeParam T - Tipo del esquema Zod (`ZodTypeAny`) que define las reglas de validación.
 *
 * @param schema - Esquema de Zod para validar.
 * @returns Implementación de ObjectTypeValidator<T>.
 */
export function createZodObjectTypeValidator<T extends z.ZodTypeAny>(
  schema: T
): ObjectTypeValidator<z.infer<T>> {
  return {
    validate(input) {
      const result = schema.safeParse(input);

      if (!result.success) {
        return {
          success: false,
          error: zodToFieldErrors(result.error),
        };
      }

      return {
        success: true,
        value: result.data,
      };
    },
  };
}


/**
 * Fábrica que genera un validador de reglas de negocio basado en un esquema Zod.
 *
 * @typeParam T - Tipo del esquema Zod (`ZodTypeAny`) que define las reglas de validación.
 * @typeParam U - Tipo de los datos a validar, generalmente coincide con el tipo que representa
 *                 la entidad de negocio.
 *
 * @param schema - Esquema Zod utilizado para validar la entrada.
 * @returns implementacion `BusinessValidator<U>`
 */
export function createZodBusinessValidator<T extends z.ZodTypeAny, U>(
  schema: T
): BusinessValidator<U> {
  return {
    validate(input: U) {
      const result = schema.safeParse(input);

      if (!result.success) {
        return {
          success: false,
          error: zodToFieldErrors(result.error),
        };
      }

      return {
        success: true,
      };
    },
  };
}
