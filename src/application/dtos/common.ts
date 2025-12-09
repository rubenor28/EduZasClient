/** Tipos de búsqueda disponibles para consultas de texto. */
export const SearchType = {
  /** Búsqueda exacta. */
  EQ: 0,
  /** Búsqueda parcial (contiene). */
  LIKE: 1,
} as const;

export type SearchType = typeof SearchType[keyof typeof SearchType];

/** Representa una consulta sobre un campo de texto. */
export type StringQuery = {
  /** Texto a buscar. */
  text: string;
  /** Tipo de búsqueda a aplicar. */
  searchType: SearchType;
};

/** Criterios base para paginación. */
export type Criteria = {
  /** Número de página actual (1-based). */
  page: number;
  /** Tamaño de la página (elementos por página). */
  pageSize?: number;
};

/** Resultado genérico de una consulta paginada. */
export type PaginatedQuery<T, C> = {
  /** Criterios utilizados para la consulta. */
  criteria: C;
  /** Lista de resultados de la página actual. */
  results: T[];
  /** Número de página actual. */
  page: number;
  /** Total de páginas disponibles. */
  totalPages: number;
};
