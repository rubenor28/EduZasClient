/**
 * Contrato para un servicio de hashing de cadenas.
 *
 * Un `Hasher` permite:
 * 1. Generar un hash seguro a partir de un texto en claro.
 * 2. Verificar si un texto coincide con un hash existente.
 *
 * Esto facilita abstraer la lógica de hashing de la aplicación,
 * pudiendo cambiar la implementación concreta (bcrypt, argon2, etc.)
 * sin afectar el resto del código.
 */
export interface Hasher {
  /**
   * Genera un hash a partir del valor de entrada.
   *
   * @param input Texto en claro que se desea hashear.
   * @returns Cadena con el valor hash correspondiente.
   */
  hash(input: string): string;

  /**
   * Comprueba si un valor en claro coincide con un hash dado.
   *
   * @param input Texto en claro a comparar.
   * @param hash Hash existente para validar coincidencia.
   * @returns `true` si el hash del valor coincide con el hash dado, de lo contrario `false`.
   */
  matches(input: string, hash: string): boolean;
}
