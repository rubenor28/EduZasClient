/**
 * Tiempos de expiración predefinidos para tokens firmados.
 */
export enum SignedTokenExpirationTime {
  Minutes15 = "15m",
  Minutes30 = "30m",
  Hours1 = "1h",
  Hours24 = "24h",
}

/**
 * Errores estandarizados para operaciones con tokens firmados.
 */
export enum SignedTokenErrors {
  /** Error desconocido o no categorizado */
  Unknown = "UnknownError",
  /** El token ha expirado según su timestamp de expiración */
  TokenExpired = "TokenExpired",
  /** El token es inválido (firma incorrecta, formato erróneo, manipulación) */
  TokenInvalid = "TokenInvalid",
}
