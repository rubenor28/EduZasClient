import jwt from "jsonwebtoken";
import { ObjectTypeValidator } from "business/common/validators";
import { Err, Ok, Result } from "ts-results";

/**
 * Servicio para la generación y validación de tokens JWT (JSON Web Tokens)
 *
 * @remarks
 * Este servicio proporciona métodos type-safe para crear y verificar tokens JWT
 * con soporte para validación de payload y manejo estructurado de errores.
 *
 * @example
 * ```typescript
 * // Generar un token
 * const token = jwtService.generate(
 *   "mi-clave-secreta",
 *   JWTExpirationTime.Hours1,
 *   { userId: 123, role: "admin" }
 * );
 *
 * // Validar un token
 * const result = jwtService.isValid(
 *   token,
 *   "mi-clave-secreta",
 *   UserPayloadValidator
 * );
 *
 * if (result.ok) {
 *   console.log("Payload válido:", result.val);
 * } else {
 *   console.log("Error:", result.val);
 * }
 * ```
 */
export const jwtService = {
  /**
   * Genera un token JWT firmado con el payload proporcionado
   *
   * @param secret - Clave secreta utilizada para firmar el token
   * @param expiresIn - Tiempo de expiración del token (ver JWTExpirationTime)
   * @param payload - Datos a incluir en el token (debe ser un objeto)
   * @returns Token JWT firmado como string
   *
   * @example
   * ```typescript
   * const token = jwtService.generate(
   *   process.env.JWT_SECRET!,
   *   JWTExpirationTime.Minutes30,
   *   { userId: 456, email: "user@example.com" }
   * );
   * ```
   */
  generate<T extends Record<string, unknown>>(
    secret: string,
    expiresIn: JWTExpirationTime,
    payload: T,
  ): string {
    return jwt.sign(payload, secret, { expiresIn });
  },

  /**
   * Valida y verifica un token JWT
   *
   * @param token - Token JWT a validar
   * @param secret - Clave secreta utilizada para verificar la firma
   * @param validator - Validador para verificar la estructura del payload decodificado
   * @returns Resultado con el payload validado o un error JWT
   *
   * @example
   * ```typescript
   * const result = jwtService.isValid(
   *   receivedToken,
   *   process.env.JWT_SECRET!,
   *   userSchemaValidator
   * );
   *
   * if (result.ok) {
   *   // Token válido, usar result.val
   * } else {
   *   // Manejar error: result.val contiene el código de error
   * }
   * ```
   */
  isValid<T extends Record<string, unknown>>(
    token: string,
    secret: string,
    validator: ObjectTypeValidator<T>,
  ): Result<T, JWTErrors> {
    try {
      const decoded = jwt.verify(token, secret);

      const validation = validator.validate(decoded);

      if (!validation.success) {
        return Err(JWTErrors.TokenInvalid);
      }

      return Ok(validation.value);
    } catch (error) {
      return Err(mapJwtError(error));
    }
  },
};

/**
 * Tiempos de expiración predefinidos para tokens JWT
 *
 * @remarks
 * Valores disponibles expresados en formato entendible por la librería jsonwebtoken
 * donde 'm' = minutos y 'h' = horas
 */
export const JWTExpirationTime = {
  /** 15 minutos de expiración */
  Minutes15: "15m",
  /** 30 minutos de expiración */
  Minutes30: "30m",
  /** 1 hora de expiración */
  Hours1: "1h",
  /** 24 horas de expiración */
  Hours24: "24h",
} as const;

/**
 * Tipo que representa los tiempos de expiración disponibles
 */
export type JWTExpirationTime =
  (typeof JWTExpirationTime)[keyof typeof JWTExpirationTime];

/**
 * Códigos de error estandarizados para operaciones JWT
 */
export const JWTErrors = {
  /** Error desconocido no categorizado */
  Unknown: "UnknownError",
  /** El token ha expirado según su claim 'exp' */
  TokenExpired: "TokenExpired",
  /** El token es inválido (firma incorrecta, formato erróneo, etc.) */
  TokenInvalid: "TokenInvalid",
} as const;

/**
 * Tipo que representa los posibles errores JWT
 */
export type JWTErrors = (typeof JWTErrors)[keyof typeof JWTErrors];

/**
 * Mapea errores de la librería jsonwebtoken a errores estandarizados
 *
 * @param error - Error capturado de la librería jwt
 * @returns Código de error estandarizado JWTErrors
 *
 * @internal
 */
const mapJwtError = (error: any): JWTErrors => {
  if (error instanceof jwt.JsonWebTokenError) return JWTErrors.TokenInvalid;
  if (error instanceof jwt.TokenExpiredError) return JWTErrors.TokenExpired;
  if (error instanceof jwt.NotBeforeError) return JWTErrors.TokenInvalid;
  return JWTErrors.Unknown;
};
