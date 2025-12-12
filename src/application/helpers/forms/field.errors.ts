import type { FieldErrorDTO } from "application/value.objects";

export const getErrorForField = (
  fieldName: string,
  fieldErrors?: FieldErrorDTO[],
) =>
  fieldErrors?.find(
    (error) => error.field.toLowerCase() === fieldName.toLowerCase(),
  );
