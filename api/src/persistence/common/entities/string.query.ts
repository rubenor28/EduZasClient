import { StringSearchType } from "../enums";

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
