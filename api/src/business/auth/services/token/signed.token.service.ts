import { ObjectTypeValidator } from "business/common/validators";
import { Result } from "ts-results";

/**
 * Tiempos de expiración predefinidos para tokens firmados.
 */
export const SignedTokenExpirationTime = {
  Minutes15: "15m",
  Minutes30: "30m",
  Hours1: "1h",
  Hours24: "24h",
} as const;

/**
 * Tipo que representa los tiempos de expiración disponibles para tokens firmados.
 */
export type SignedTokenExpirationTime =
  (typeof SignedTokenExpirationTime)[keyof typeof SignedTokenExpirationTime];

/**
 * Errores estandarizados para operaciones con tokens firmados.
 */
export const SignedTokenErrors = {
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
export type SignedTokenErrors =
  (typeof SignedTokenErrors)[keyof typeof SignedTokenErrors];

/**
 * Interfaz que define el contrato para un servicio de tokens firmados.
 */
export interface SignedTokenService {
  /**
   * Genera un token firmado con el payload proporcionado.
   *
   * @typeParam T - Tipo del payload, debe extender `Record<string, unknown>`
   * @param secret - Secreto utilizado para firmar el token
   * @param expiresIn - Tiempo de expiración en formato de string
   * @param payload - Datos a incluir en el token como claims
   * @returns Token firmado como string codificado
   *
   * @example
   * ```typescript
   * const token = service.generate(
   *   "my-secret-key",
   *   SignedTokenExpirationTime.Hours1,
   *   { userId: 123, role: "admin" }
   * );
   * ```
   */
  generate<T extends Record<string, unknown>>(
    secret: string,
    expiresIn: string,
    payload: T,
  ): string;

  /**
   * Valida y verifica un token firmado.
   *
   * @typeParam T - Tipo esperado del payload decodificado
   * @param token - Token a validar en formato string codificado
   * @param secret - Secreto utilizado para verificar la firma
   * @param validator - Validador para verificar la estructura del payload
   * @returns `Result` con el payload validado o un error de `SignedTokenErrors`
   *
   * @example
   * ```typescript
   * const result = service.isValid(
   *   token,
   *   "my-secret-key",
   *   userValidator
   * );
   *
   * if (result.ok) {
   *   console.log("User:", result.val);
   * } else {
   *   console.error("Error:", result.val);
   * }
   * ```
   */
  isValid<T extends Record<string, unknown>>(
    token: string,
    secret: string,
    validator: ObjectTypeValidator<T>,
  ): Result<T, SignedTokenErrors>;
}
