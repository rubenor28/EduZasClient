import type { FieldErrorDTO } from "application/value.objects";

export const getFieldError = (
  fieldName: string,
  fieldErrors?: FieldErrorDTO[],
) =>
  fieldErrors?.find(
    (error) => error.field.toLowerCase() === fieldName.toLowerCase(),
  );
