import axios from "axios";
import { VITE_API_URL } from "config";
import type { FieldError } from "entities/common/entities";
import type { User, UserCredentials } from "entities/users/entities";
import { type Result, Ok, Err } from "entities/common/valueObjects";

const authEndpoint = `${VITE_API_URL}/auth`;

/**
 * Errores estandarizados para operaciones con tokens de
 * autenticacion.
 */
export const TokenErrors = {
  /** Error desconocido o no categorizado */
  Unknown: "UnknownError",
  /** El token ha expirado según su timestamp de expiración */
  TokenExpired: "TokenExpired",
  /** El token es inválido (firma incorrecta, formato erróneo, manipulación) */
  TokenInvalid: "TokenInvalid",
} as const;

/**
 * Tipo que representa los posibles errores al trabajar con tokens firmados.
 */
export type TokenErrors = (typeof TokenErrors)[keyof typeof TokenErrors];

export const authService = {
  async login(
    credentials: UserCredentials,
  ): Promise<Result<User, FieldError[]>> {
    const response = await axios.post(authEndpoint, credentials, {
      withCredentials: true,
      validateStatus: (status) => status <= 500,
    });

    if (response.status >= 400) {
      return Err(response.data.error as FieldError[]);
    }

    return Ok(response.data.user as User);
  },

  async isAuth(): Promise<Result<User, TokenErrors>> {
    const response = await axios.get(authEndpoint, {
      withCredentials: true,
      validateStatus: (status) => status <= 500,
    });

    if (response.status >= 400) {
      const msg = `${response.data?.message ?? ""}`;

      switch (msg) {
        case "TokenExpired":
          return Err(TokenErrors.TokenExpired);
        case "TokenInvalid":
          return Err(TokenErrors.TokenInvalid);
        case "UnauthenticatedError":
          return Err(TokenErrors.TokenInvalid);
        default:
          return Err(TokenErrors.Unknown);
      }
    }

    return Ok(response.data.user as User);
  },

  async logout() {
    await axios.delete(authEndpoint, {
      withCredentials: true,
    });
  },
};
