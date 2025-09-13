import jwt from "jsonwebtoken";
import { SignedTokenService } from "./signed.token.service";
import { ObjectTypeValidator } from "business/common/validators";
import { Result, Ok, Err } from "persistence/common/valueObjects";

import {
  SignedTokenErrors,
  SignedTokenExpirationTime,
} from "persistence/common/enums";

/**
 * Implementación de `SignedTokenService` que utiliza la biblioteca **jsonwebtoken**.
 *
 * Este servicio se encarga de la generación y validación de JSON Web Tokens (JWTs).
 *
 * Características principales:
 * - Utiliza `jwt.sign` para crear tokens.
 * - Emplea `jwt.verify` para validar la firma y la expiración.
 * - Integra un `ObjectTypeValidator` para validar la estructura del payload del token.
 * - Devuelve un objeto `Result` para un manejo de errores seguro y explícito.
 *
 * @implements {SignedTokenService}
 * @see https://www.npmjs.com/package/jsonwebtoken
 */
export const jwtService: SignedTokenService = {
  /**
   * {@inheritDoc SignedTokenService.generate}
   * Implementado directamente con `jwt.sign`.
   */
  generate<T extends Record<string, unknown>>(
    secret: string,
    expiresIn: SignedTokenExpirationTime,
    payload: T,
  ): string {
    return jwt.sign(payload, secret, { expiresIn });
  },

  /**
   * {@inheritDoc SignedTokenService.isValid}
   *
   * El proceso de validación consta de dos pasos:
   * 1. Verifica la firma y la expiración del token usando `jwt.verify`.
   * 2. Si es válido, utiliza el `validator` proporcionado para asegurar que el
   * payload tiene la estructura y tipos de datos esperados.
   *
   * Los errores de `jsonwebtoken` se mapean a errores del dominio a través de `mapJwtError`.
   */
  isValid<T extends Record<string, unknown>>(
    token: string,
    secret: string,
    validator: ObjectTypeValidator<T>,
  ): Result<T, SignedTokenErrors> {
    try {
      // 1. Decodifica y verifica el token.
      const decoded = jwt.verify(token, secret);

      // 2. Separa los claims estándar (iat, exp) del payload personalizado.
      const { iat, exp, ...payload } = decoded as any;

      // 3. Valida la estructura del payload personalizado.
      const validation = validator.validate(payload);

      if (!validation.success) {
        return Err(SignedTokenErrors.TokenInvalid);
      }

      return Ok(validation.value);
    } catch (error) {
      // 4. Mapea errores de la librería a errores de la aplicación.
      return Err(mapJwtError(error));
    }
  },
};

/**
 * Traduce un error de la biblioteca `jsonwebtoken` a un `SignedTokenErrors` del dominio.
 *
 * @param error El error de origen, de tipo `unknown`.
 * @returns El miembro del enum `SignedTokenErrors` correspondiente.
 * @internal
 */
const mapJwtError = (error: unknown): SignedTokenErrors => {
  if (error instanceof jwt.TokenExpiredError)
    return SignedTokenErrors.TokenExpired;

  if (error instanceof jwt.JsonWebTokenError)
    return SignedTokenErrors.TokenInvalid;

  // NotBeforeError también se considera inválido en este contexto.
  if (error instanceof jwt.NotBeforeError)
    return SignedTokenErrors.TokenInvalid;

  return SignedTokenErrors.Unknown;
};
