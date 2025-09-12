/**
 * Representa un contrato para servicios que generan tokens opacos.
 *
 * Un token opaco es una cadena de caracteres única (como un hash, un UUID o un nonce)
 * que no está diseñada para ser inspeccionada o validada por el cliente.
 * Su propósito es servir como un identificador o una clave simple.
 *
 * @template T - El tipo de las opciones que se pueden proporcionar para la generación del token.
 * Se establece en `void` por defecto si no se requieren opciones.
 *
 * @example
 * ```typescript
 * // Ejemplo de implementación sin opciones
 * class SimpleNonceGenerator implements OpaqueTokenGenerator {
 * public generateToken(): string {
 * return Math.random().toString(36).substring(2);
 * }
 * }
 *
 * // Ejemplo de implementación con opciones
 * interface UserTokenOptions {
 * userId: number;
 * salt: string;
 * }
 *
 * class UserHashGenerator implements OpaqueTokenGenerator<UserTokenOptions> {
 * public generateToken(opts: UserTokenOptions): string {
 * // Lógica para generar un hash usando opts.userId y opts.salt
 * return `hash_for_${opts.userId}_with_${opts.salt}`;
 * }
 * }
 * ```
 */
export interface OpaqueTokenGenerator<T = void> {
  /**
   * Genera una nueva cadena de token.
   *
   * @param opts - Un objeto que contiene las opciones para personalizar la generación del token.
   * @returns Una cadena de texto que representa el token recién generado.
   */
  generateToken(opts: T): string;
}
