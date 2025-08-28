import z from "zod"

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
export const criteriaSchema = {
  page: z.number().min(1).optional().default(1),
};
