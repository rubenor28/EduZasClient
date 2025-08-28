/**
 * Enumera los modos de búsqueda de cadenas disponibles.
 *
 * - `EQ` realiza una comparación de igualdad estricto.
 * - `LIKE` realiza una comparación parcial (similar a SQL `LIKE`).
 */
export enum StringSearchType {
  /** Búsqueda exacta: el valor debe coincidir exactamente. */
  EQ = "equals",
  /** Búsqueda parcial: el valor puede contener el término buscado. */
  LIKE = "like",
}
