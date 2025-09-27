/**
 * Define los criterios de consulta y paginación.
 * Este tipo se utiliza para indicar la página
 * solicitada en operaciones de paginación.
 */
export type CriteriaDTO = {
  /** Número de página a recuperar */
  page: number;
};
