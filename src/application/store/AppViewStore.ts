export type AppViewStatus =
  | "idle"
  | "forbid"
  | "interal_server_error"
  | "not_found";

export interface AppViewStore {
  status: AppViewStatus;
  setStatus(state: AppViewStatus): void;
}

export type AppViewHook = () => AppViewStore;
