import { Ok, Err, type UserDomain, AuthErrors } from "@domain";
import type { AuthService } from "@application";
import type { FieldErrorResponseDTO, WithDataResponse } from "../../dtos";

export function createFetchAuthService(apiUrl: string): AuthService {
  const service: AuthService = {
    async signIn(creds) {
      const response = await fetch(`${apiUrl}/auth/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(creds),
      });

      if (response.status >= 500) throw Error("Internal server error");

      if (response.status >= 400) {
        const error: FieldErrorResponseDTO = await response.json();
        return Err(error.errors);
      }

      const user: UserDomain = await response.json();
      return Ok(user);
    },

    async isAuth() {
      const response = await fetch(`${apiUrl}/auth/me`, {
        credentials: "include",
      });

      if (response.status === 200) {
        const parsedRes: WithDataResponse<UserDomain> = await response.json();
        return Ok(parsedRes.data);
      }

      if (response.status >= 401) return Err(AuthErrors.Unauthorized);
      if (response.status >= 403) return Err(AuthErrors.Forbidden);

      throw Error("Internal server error");
    },

    async login(creds) {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(creds),
      });

      if (response.status >= 500) throw Error("Internal server error");

      if (response.status >= 400) {
        const error: FieldErrorResponseDTO = await response.json();
        return Err(error.errors);
      }

      const parsedRes: UserDomain = await response.json();
      return Ok(parsedRes);
    },

    async logout() {
      const response = await fetch(`${apiUrl}/auth/logout`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.status >= 400) throw Error("Internal server error");
    },
  };

  return service;
}
