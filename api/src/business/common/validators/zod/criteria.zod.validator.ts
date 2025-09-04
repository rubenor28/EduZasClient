import z from "zod";

/**
 * Esquema Zod base para criterios de paginación y filtrado genéricos.
 *
 * Campos:
 * - page: número de página de los resultados.
 *   - Debe ser un número mayor o igual a 1.
 *   - Es opcional; si no se proporciona, por defecto se usa `1`.
 *
 * Este esquema puede extenderse para incluir otros filtros comunes
 * en consultas paginadas o búsquedas.
 */
export const criteriaTypeSchema = {
  page: z.number("La página debe ser un número").optional().default(1),
};

export const criteriaBusinessSchema = {
  page: z
    .number("La página debe ser un número")
    .int("La página debe ser un entero")
    .positive("La página debe ser un número positivo")
    .optional()
    .default(1),
};
