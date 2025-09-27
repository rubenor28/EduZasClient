import { StringSearchType } from "@domain";

/**
 * Representa una consulta de texto con un tipo específico de búsqueda.
 *
 * @remarks
 * Se utiliza para encapsular una cadena de texto junto con el tipo de búsqueda
 * que debe aplicarse (exacta, parcial, etc.), permitiendo consultas más flexibles.
 */
export type StringQueryDTO = {
  /** Texto a consultar */
  text: string;
  /** Tipo de búsqueda a aplicar */
  searchType: StringSearchType;
};

