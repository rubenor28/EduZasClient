import type { ProfessorClassRelationDTO } from "./ProfessorClassRelationDTO";

/**
 * DTO para criterios de búsqueda de relaciones profesor-clase
 * @extends Partial<ProfessorClassRelationDTO>
 * @remarks
 * Permite realizar búsquedas flexibles donde cualquiera de los campos
 * puede ser utilizado como filtro de forma opcional
 */
export type ProfessorClassRelationCriteriaDTO =
  Partial<ProfessorClassRelationDTO>;
