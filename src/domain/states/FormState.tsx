import type { FieldErrorDTO } from "@application";
import { Alert, AlertType } from "@components";

type InputError<T extends object> = {
  [K in keyof T]?: string;
};

export type FormState<T extends object> =
  | { state: "idle" | "loading" | "success" | "unexpected_error" }
  | ({ state: "input_error" } & InputError<T>);

export function alertIfInputError<T extends object>(
  state: FormState<T>,
  field: keyof T,
  type: AlertType = "warning",
) {
  return state.state === "input_error" && state[field] ? (
    <Alert type={type} message={state[field]} />
  ) : (
    <></>
  );
}

export function fieldErrorsToErrorDictionary(fieldErrors: FieldErrorDTO[]) {
  return fieldErrors.reduce(
    (errorDictionary, currentError) => ({
      ...errorDictionary,
      [currentError.field]: currentError.message,
    }),
    {}, // ← Valor inicial: objeto vacío
  );
}
