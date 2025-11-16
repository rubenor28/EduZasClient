import type { FieldErrorDTO } from "./FieldErrorDTO";

export type APIErrorDTO =
  | {
      type:
        | "already-exists"
        | "unauthorized"
        | "forbid"
        | "not-found"
        | "internal-server-error";
    }
  | { type: "input-error"; data: FieldErrorDTO[] };
