/**
 * Expresión regular que valida nombres simples compuestos solo por letras mayúsculas,
 * incluyendo caracteres acentuados o la letra Ñ y al menos 3 caracteres.
 *
 * Ejemplos válidos:
 * - "JUAN"
 * - "ÁNGELA"
 * - "ÑANDÚ"
 */
export const simpleNameRegex = /^[A-ZÁÉÍÓÚÜÑ]{3,}$/;

/**
 * Expresión regular que valida nombres compuestos que comienzan con
 * preposiciones o artículos comunes en nombres en español, seguidos
 * de una palabra en mayúsculas y al menos 3 caracteres.
 *
 * Ejemplos válidos:
 * - "DE LA CRUZ"
 * - "DEL RÍO"
 * - "LAS FLORES"
 * - "AL ÁNDALUS"
 */
export const compositeNameRegex =
  /^(?:DE\s(?:LA|LAS|LOS|EL)|DEL|DE|LA|LAS|LOS|EL|AL)\s[A-ZÁÉÍÓÚÜÑ]{3,}$/;

/**
 * Expresión regular para validar matrículas (tuition) con el siguiente formato:
 *
 * - 3 letras mayúsculas (pueden incluir acentos o Ñ),
 * - seguidas de una letra que representa el periodo:
 *   - `O`, `I`, `P`, `V`,
 * - seguidas de 6 dígitos.
 *
 * Ejemplos válidos:
 * - `ABC012345`
 * - `ÁÑT012345`
 * - `XYZI123456`
 */
export const tuitionRegex = /^[A-ZÁÉÍÓÚÜÑ]{3}[OIPV]\d{6}$/;

/**
 * Expresión regular que valida una contraseña, espera
 * ^ y $ — anclan el inicio y el fin de la cadena, para que toda la contraseña se valide completa.
 *
 * (?=.*[a-z]) — asegura al menos una letra minúscula.
 *
 * (?=.*[A-Z]) — asegura al menos una letra mayúscula.
 *
 * (?=.*[^A-Za-z0-9]) — asegura al menos un carácter especial (cualquier caracter que no sea letra ni dígito).
 *
 * .{8,} — exige un largo mínimo de 8 caracteres (pueden ser cualesquiera, pues los requisitos de contenido ya los verifican los lookahead).
 */
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;
