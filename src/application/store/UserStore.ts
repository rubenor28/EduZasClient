import type { UserDomain } from "@domain";

export type AuthStatus = { type: "guest" } | { type: "user"; data: UserDomain };

export interface AuthStore {
  status: AuthStatus;
  setStatus(state: AuthStatus): void;
}

export type AuthHook = () => AuthStore;
