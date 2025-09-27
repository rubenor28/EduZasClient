/**
 * Representa el resultado de una consulta paginada.
 *
 * @typeParam T - Tipo de los elementos contenidos en los resultados
 * @typeParam C - Tipo de los criterios utilizados para la consulta
 */
export type PaginatedQuery<T, C> = {
  /** Criterios de la consulta aplicada */
  criteria: C;
  /** Lista de resultados obtenidos en la página actual */
  results: T[];
  /** Número de la página actual */
  page: number;
  /** Número total de páginas disponibles */
  totalPages: number;
};
