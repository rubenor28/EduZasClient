import type { FieldError } from "entities/common/entities";

/**
 * Mapea FieldError[] a un Partial<Record<keyof T, string>>
 * usando una lista de keys en tiempo de ejecución.
 *
 * @param errors - Errores del backend.
 * @param keys - Lista de keys válidas en runtime (ej. NEW_USER_KEYS).
 */
export function mapFieldErrorsToFieldMessageMapFromKeys<
  T extends Record<string, unknown>,
>(
  errors: FieldError[],
  keys: ReadonlyArray<keyof T>,
): Partial<Record<keyof T, string>> {
  const allowed = new Set(keys.map(String)); // Set<string>
  const payload: Partial<Record<keyof T, string>> = {};

  for (const err of errors) {
    if (typeof err.field === "string" && allowed.has(err.field)) {
      payload[err.field as keyof T] = err.message;
    }
  }

  return payload;
}
