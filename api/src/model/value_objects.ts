/**
 * Representa un objeto identificable por una clave única.
 *
 * @template I - Tipo del identificador (por ejemplo, `number`, `string`, `UUID`, etc.).
 */
export type Identifiable<I> = {
  /** Identificador único del objeto. */
  id: I;
};

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

/**
 * Define una consulta sobre un campo de tipo cadena,
 * especificando el término y el tipo de comparación.
 */
export type StringQuery = {
  /** Cadena de texto sobre la cual se realiza la búsqueda. */
  string: string;
  /** Tipo de comparación a aplicar. */
  searchType: StringSearchType;
};

/**
 * Representa un error ocurrido en un campo específico durante
 * un proceso de validación o procesamiento.
 */
export type FieldErrorDTO = {
  /** Nombre del campo que provocó el error. */
  field: string;
  /** Mensaje descriptivo del error. */
  error: string;
};

/**
 * Encapsula los resultados de una consulta paginada,
 * junto con la metadata de paginación y los criterios aplicados.
 *
 * @template T - Tipo de los elementos en la lista de resultados.
 * @template C - Tipo del objeto que contiene los criterios de búsqueda.
 */
export type PaginatedQuery<T, C> = {
  /** Número de página actual (basada en 1). */
  page: number;
  /** Total de páginas disponibles. */
  totalPages: number;
  /** Criterios usados para filtrar o buscar. */
  criteria: C;
  /** Lista de resultados correspondientes a la página actual. */
  results: T[];
};
