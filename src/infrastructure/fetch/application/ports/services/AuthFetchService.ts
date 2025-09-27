import { Ok, Err, type UserDomain } from "@domain";
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

      if (response.status >= 500) throw Error("Internal server error");
      if (response.status >= 400) return undefined;

      const parsedRes: WithDataResponse<UserDomain> = await response.json();
      return parsedRes.data;
    },

    async login(creds) {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(creds),
      });

      console.log("Response status ", response.status);

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
