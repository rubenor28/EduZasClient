import { OpaqueTokenGenerator } from "./token.service";

/**
 * Fábrica para crear una instancia configurable de un generador de tokens.
 *
 * Esta función permite crear un generador de tokens especificando el conjunto
 * de caracteres permitidos y la longitud deseada para el token.
 *
 * @param allowedChars El string que contiene todos los caracteres que se pueden usar para generar el token.
 * @param tokenLength La longitud exacta que tendrá cada token generado. Debe ser un número entero.
 * @returns Un objeto que cumple con la interfaz `OpaqueTokenGenerator`, listo para ser usado.
 * @throws {Error} Si `tokenLength` no es un número entero.
 *
 * @example
 * ```typescript
 * // Crear un generador para un PIN numérico de 4 dígitos
 * const pinGenerator = createTokenGenerator('0123456789', 4);
 * const myPin = pinGenerator.generateToken(); // "7301"
 *
 * // Crear un generador para un código de referencia de 8 caracteres en mayúsculas
 * const refCodeGenerator = createTokenGenerator('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8);
 * const myRef = refCodeGenerator.generateToken(); // "T4K9V3P1"
 * ```
 */
export function createTokenGenerator(
  allowedChars: string,
  tokenLength: number,
): OpaqueTokenGenerator {
  if (!Number.isInteger(tokenLength) || tokenLength < 0) {
    throw new Error("tokenLength must be a positive integer.");
  }

  if (allowedChars.length === 0) {
    throw new Error("allowedChars cannot be an empty string.");
  }

  return {
    generateToken() {
      let result = "";
      const charsLength = allowedChars.length;

      for (let i = 0; i < tokenLength; i++) {
        const randomIndex = Math.floor(Math.random() * charsLength);
        result += allowedChars.charAt(randomIndex);
      }

      return result;
    },
  };
}
