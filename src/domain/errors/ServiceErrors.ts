import type { FieldErrorDTO } from "@application";
import { AuthErrors } from "./AuthErrors";
import type { FieldErrorResponseDTO } from "@infrastructure-fetch";

export type ServiceError =
  | { type: "authError"; error: AuthErrors }
  | { type: "inputError"; error: FieldErrorDTO[] };

const ServiceErrors: Record<number, (res: Response) => Promise<ServiceError>> =
  {
    [403]: async () => ({ type: "authError", error: AuthErrors.Forbidden }),
    [401]: async () => ({ type: "authError", error: AuthErrors.Unauthorized }),
    [400]: async (res) => {
      const value: FieldErrorResponseDTO = await res.json();
      return { type: "inputError", error: value.errors };
    },
  };

export const serviceErrorResponseParser = async (
  res: Response,
): Promise<ServiceError | undefined> => {
  const status = res.status;

  if (status in ServiceErrors) {
    return ServiceErrors[status](res);
  }

  return undefined;
};
