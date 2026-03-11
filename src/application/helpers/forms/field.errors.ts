import type { FieldErrorDTO } from "application/value.objects";

/**
 * Busca y devuelve el error asociado a un campo específico dentro de una lista de errores de validación.
 * @param fieldName El nombre del campo a buscar (insensible a mayúsculas/minúsculas).
 * @param fieldErrors La lista de errores de validación devuelta por la API.
 * @returns El objeto `FieldErrorDTO` si se encuentra, de lo contrario `undefined`.
 */
export const getFieldError = (
  fieldName: string,
  fieldErrors?: FieldErrorDTO[],
) =>
  fieldErrors?.find(
    (error) => error.field.toLowerCase() === fieldName.toLowerCase(),
  );
