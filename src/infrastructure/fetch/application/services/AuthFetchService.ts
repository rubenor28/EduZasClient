import { Ok, Err } from "@domain";
import type { AppHook, AuthService } from "@application";
import { mapAPIError } from "application/services/APIServices";

export function createFetchAuthService(
  apiUrl: string,
  appHook: AppHook,
): AuthService {
  const appStore = appHook();

  const service: AuthService = {
    appStore,
    async signIn(creds) {
      const res = await fetch(`${apiUrl}/auth/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(creds),
      });

      if (!res.ok) return Err(await mapAPIError(res));
      return Ok(await res.json());
    },

    async isAuth() {
      const res = await fetch(`${apiUrl}/auth/me`, {
        credentials: "include",
      });

      if (!res.ok) return Err(await mapAPIError(res));
      return Ok(await res.json());
    },

    async login(creds) {
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(creds),
      });

      if (!res.ok) return Err(await mapAPIError(res));
      return Ok(await res.json());
    },

    async logout() {
      const res = await fetch(`${apiUrl}/auth/logout`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) return Err(await mapAPIError(res));
      return Ok(undefined);
    },
  };

  return service;
}
