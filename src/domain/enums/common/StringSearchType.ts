/**
 * Enumera los modos de búsqueda de cadenas disponibles.
 *
 * - `EQ` realiza una comparación de igualdad estricta.
 * - `LIKE` realiza una comparación parcial (similar a SQL `LIKE`).
 */
export const StringSearchType = {
  /** Búsqueda exacta: el valor debe coincidir exactamente. */
  EQ: "EQUALS",
  /** Búsqueda parcial: el valor puede contener el término buscado. */
  LIKE: "LIKE",
} as const;

/**
 * Tipo que representa los valores posibles de {@link StringSearchType}.
 */
export type StringSearchType =
  (typeof StringSearchType)[keyof typeof StringSearchType];
