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
