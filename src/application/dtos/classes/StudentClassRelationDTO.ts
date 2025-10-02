/**
 * DTO que define la relación entre un estudiante y una clase académica
 * @interface StudentClassRelationDTO
 */
export type StudentClassRelationDTO = {
  /** Identificador único del estudiante */
  studentId: number;
  /** Identificador único de la clase */
  classId: string;
  /** Indica si la clase está oculta para el estudiante */
  hidden: boolean;
};
