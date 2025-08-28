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
