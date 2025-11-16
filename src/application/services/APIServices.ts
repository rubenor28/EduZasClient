import type { AppViewStore, FieldErrorDTO } from "@application";

export interface APIService {
  readonly appStore: AppViewStore;
}

export type APIServiceErrors =
  | {
      type:
        | "already-exists"
        | "unauthorized"
        | "forbid"
        | "not-found"
        | "internal-server-error";
    }
  | { type: "input-error"; data: FieldErrorDTO };

export async function mapAPIError(res: Response): Promise<APIServiceErrors> {
  const statusErrors: Record<number, APIServiceErrors> = {
    400: { type: "input-error", data: (await res.json()).errors },
    401: { type: "unauthorized" },
    403: { type: "forbid" },
    404: { type: "not-found" },
    409: { type: "already-exists" },
    500: { type: "internal-server-error" },
  };

  return statusErrors[res.status] ?? statusErrors[500];
}
