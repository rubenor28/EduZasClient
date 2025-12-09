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

/** Identificador compuesto para la relación entre un usuario y una clase. */
export type UserClassRelationID = {
  /** ID del usuario. */
  userId: number;
  /** ID de la clase. */
  classId: string;
};

/** Representa la relación de un profesor con una clase. */
export type ClassProfessor = {
  /** Identificador de la relación. */
  id: UserClassRelationID;
  /** Indica si el profesor es el creador/propietario de la clase. */
  isOwner: boolean;
};
