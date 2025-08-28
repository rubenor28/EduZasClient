import { PrismaStringQuery, StringQuery } from "../entities";
import { StringSearchType } from "../enums";

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
