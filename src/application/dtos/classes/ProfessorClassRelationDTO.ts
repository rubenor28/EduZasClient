/**
 * DTO que define la relación entre un profesor y una clase académica
 * @interface ProfessorClassRelationDTO
 */
export type ProfessorClassRelationDTO = {
  /** Identificador único del profesor */
  professorId: number;
  /** Identificador único de la clase */
  classId: string;
  /** Indica si el profesor es el propietario/creador de la clase */
  isOwner: boolean;
};
