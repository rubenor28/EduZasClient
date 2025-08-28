import z from "zod"
import { ObjectTypeValidator } from "../type.validator";
import { ObjectTypeValidation } from "persistence/common/entities";
import { zodToFieldErrors } from "persistence/common/mappers";

/**
 * Fábrica que genera un validador a partir de un esquema de Zod.
 *
 * @param schema - Esquema de Zod para validar.
 * @returns Implementación de ObjectTypeValidator<T>.
 */
export function createZodObjectTypeValidator<T extends z.ZodTypeAny>(
  schema: T
): ObjectTypeValidator<z.infer<T>> {
  return {
    validate(input: unknown): ObjectTypeValidation<z.infer<T>> {
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
