/**
 * Representa una entidad de Clase.
 * Este tipo define la estructura de una clase académica en el sistema.
 * Corresponde a la entidad 'Class' en el dominio de la API EduZas.
 */
export type Class = {
  /** Identificador único de la clase. */
  id: string;
  /** Indica si la clase está activa. */
  active: boolean;
  /** Nombre de la clase (ej. "Matemáticas I", "Historia Universal"). */
  className: string;
  /** Asignatura o materia a la que pertenece la clase (opcional). */
  subject?: string;
  /** Sección o grupo específico de la clase (opcional). */
  section?: string;
  /** Color asociado a la clase para propósitos de UI. */
  color: string;
};

export type UserClassRelationID = {
  userId: number;
  classId: string;
};

export type ClassProfessor = {
  id: UserClassRelationID;
  isOwner: boolean;
};
