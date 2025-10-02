import type { StudentClassRelationDTO } from "./StudentClassRelationDTO";

/**
 * DTO para criterios de búsqueda de relaciones estudiante-clase
 * @extends Partial<StudentClassRelationDTO>
 * @remarks
 * Permite realizar búsquedas flexibles donde cualquiera de los campos
 * puede ser utilizado como filtro de forma opcional
 */
export type StudentClassRelationCriteriaDTO = Partial<StudentClassRelationDTO>;
