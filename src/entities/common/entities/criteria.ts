/**
 * Tipo base que representa criterios generales de búsqueda.
 *
 * Este tipo puede combinarse con otros usando intersección (`&`) para construir
 * criterios más específicos en otros contextos, como filtros por campos específicos.
 *
 * @property page - Número de página que se desea consultar (usualmente comenzando en 1).
 *
 * @example
 * // Criterios específicos para usuarios, combinando con el tipo base
 * export type UserCriteria = Criteria & {
 *   name?: string;
 *   role?: 'ADMIN' | 'STUDENT' | 'PROFESSOR';
 * };
 */
export type Criteria = {
  page: number;
};
