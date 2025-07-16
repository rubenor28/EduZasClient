import { StringSearchType, type StringQuery } from "../model";

/**
 * Representa la estructura esperada para consultas de cadena compatibles con Prisma.
 *
 * Ambos campos son opcionales porque solo uno se usará según el tipo de búsqueda.
 */
export type PrismaStringQuery = {
  /** Busca coincidencia exacta con la cadena dada. */
  equals?: string;
  /** Busca coincidencia parcial (contiene) con la cadena dada. */
  contains?: string;
};

/**
 * Convierte un objeto `StringQuery` definido en la lógica de negocio
 * a una consulta compatible con Prisma ORM.
 *
 * @param query - Consulta de cadena con tipo de búsqueda.
 * @returns Un objeto con propiedad `equals` o `contains` para Prisma.
 *
 * @throws Lanza un error si `searchType` no es válido.
 */
export const stringQueryToPrisma = (query: StringQuery): PrismaStringQuery => {
  switch (query.searchType) {
    case StringSearchType.EQ:
      return { equals: query.string };
    case StringSearchType.LIKE:
      return { contains: query.string };
    default:
      throw new Error("Option not valid");
  }
};

/**
 * Versión segura de `stringQueryToPrisma` que acepta un parámetro opcional.
 *
 * @param query - Consulta de cadena o `undefined`.
 * @returns Consulta compatible con Prisma o `undefined` si no se proporciona.
 */
export const optionalStringQueryToPrisma = (
  query?: StringQuery,
): PrismaStringQuery | undefined => {
  return query === undefined ? undefined : stringQueryToPrisma(query);
};
