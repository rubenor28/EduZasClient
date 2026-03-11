import type { Criteria, StringQuery } from "@application";

/** DTO para la creación de un nuevo profesor en una clase. */
export type Professor = {
  /** ID del usuario profesor. */
  userId: number;
  /** Indica si es el propietario de la clase. */
  isOwner: boolean;
};

/**
 * DTO para la creación de una nueva clase.
 * Contiene los datos necesarios para registrar una clase en el sistema.
 * Corresponde a un DTO de la capa de aplicación de la API EduZas.
 */
export type NewClass = {
  /** Nombre de la clase (ej. "Matemáticas I", "Historia Universal"). */
  className: string;
  /** Asignatura o materia a la que pertenece la clase (opcional). */
  subject?: string;
  /** Sección o grupo específico de la clase (opcional). */
  section?: string;
  /** Color asociado a la clase para propósitos de UI. */
  color: string;
  /** ID del propietario (profesor) de la clase. */
  ownerId: number;
  /** Lista de profesores a añadir a la clase. */
  professors?: Professor[];
};

/**
 * DTO para la actualización de una clase existente.
 * Contiene los datos que pueden ser modificados para una clase.
 * Corresponde a un DTO de la capa de aplicación de la API EduZas.
 */
export type ClassUpdate = {
  /** Identificador único de la clase a actualizar. */
  id: string;
  /** Estado de actividad de la clase. */
  active: boolean;
  /** Nuevo nombre de la clase. */
  className: string;
  /** Nueva asignatura o materia de la clase (opcional). */
  subject?: string;
  /** Nueva sección o grupo de la clase (opcional). */
  section?: string;
  /** Nuevo color asociado a la clase. */
  color: string;
};

/**
 * DTO para especificar criterios de búsqueda y filtrado de clases.
 * Permite buscar clases por varios atributos y relaciones.
 * Corresponde a un DTO de la capa de aplicación de la API EduZas.
 */
export type ClassCriteria = Criteria & {
  /** Filtra por el estado de actividad de la clase. */
  active?: boolean;
  /** Filtra por el nombre de la clase, utilizando consultas de cadena. */
  className?: StringQuery;
  /** Filtra por la asignatura de la clase, utilizando consultas de cadena. */
  subject?: StringQuery;
  /** Filtra por la sección de la clase, utilizando consultas de cadena. */
  section?: StringQuery;
  /**
   * Filtra clases asociadas a un profesor específico.
   * `id`: ID del profesor.
   * `isOwner`: Si es true, busca clases donde el profesor es el propietario.
   */
  withProfessor?: { id: number; isOwner?: boolean };
  /**
   * Filtra clases asociadas a un estudiante específico.
   * `id`: ID del estudiante.
   * `hidden`: Si es true, busca clases que el estudiante tiene ocultas.
   */
  withStudent?: { id: number; hidden?: boolean };
};

/** Criterios de búsqueda para la relación clase-profesor. */
export type ClassProfessorCriteria = Criteria & {
  /** Filtrar por ID de usuario. */
  userId?: number;
  /** Filtrar por ID de clase. */
  classId?: string;
  /** Filtrar por estado de propiedad. */
  isOwner?: boolean;
};

/** Resumen de una clase para la vista del profesor. */
export type ProfessorClassesSummary = {
  /** ID único de la clase. */
  classId: string;
  /** Indica si la clase está activa. */
  active: boolean;
  /** Nombre de la clase. */
  className: string;
  /** Asignatura (opcional). */
  subject?: string;
  /** Sección (opcional). */
  section?: string;
  /** Color de la clase. */
  color: string;
  /** Indica si el profesor es el propietario. */
  owner: boolean;
};

/** Criterios para buscar el resumen de clases de un profesor. */
export type ProfessorClassesSummaryCriteria = Criteria & {
  /** Filtra por estado activo. */
  active?: boolean;
  /** Filtra por nombre de clase. */
  className?: StringQuery;
  /** Filtra por asignatura. */
  subject?: StringQuery;
  /** Filtra por sección. */
  section?: StringQuery;
  /** ID del profesor. */
  professorId: number;
};

/** Resumen de una clase para la vista del estudiante. */
export type StudentClassesSummary = {
  /** ID único de la clase. */
  classId: string;
  /** Indica si la clase está activa. */
  active: boolean;
  /** Nombre de la clase. */
  className: string;
  /** Asignatura (opcional). */
  subject?: string;
  /** Sección (opcional). */
  section?: string;
  /** Color de la clase. */
  color: string;
  /** Indica si el estudiante tiene la clase oculta. */
  hidden: boolean;
};

/** Criterios para buscar el resumen de clases de un estudiante. */
export type StudentClassesSummaryCriteria = Criteria & {
  /** Filtra por estado activo de la clase. */
  active?: boolean;
  /** Filtra por si la clase está oculta para el estudiante. */
  hidden?: boolean;
  /** Filtra por nombre de clase. */
  className?: StringQuery;
  /** Filtra por asignatura. */
  subject?: StringQuery;
  /** Filtra por sección. */
  section?: StringQuery;
  /** ID del estudiante. */
  studentId: number;
};

/** DTO para el resumen de un profesor en una clase. */
export type ClassProfessorSummary = {
  /** ID del usuario profesor. */
  userId: number;
  /** Correo electrónico del profesor. */
  email: string;
  /** Alias del profesor (si existe en contactos). */
  alias?: string;
  /** Primer nombre del profesor. */
  firstName: string;
  /** Segundo nombre del profesor (opcional). */
  midName?: string;
  /** Apellido paterno del profesor. */
  fatherLastName: string;
  /** Apellido materno del profesor (opcional). */
  motherLastname?: string;
  /** Indica si el profesor es el propietario de la clase. */
  owner: boolean;
};

/** Criterios para buscar el resumen de profesores de una clase. */
export type ClassProfessorSummaryCriteria = Criteria & {
  /** ID de la clase. */
  ClassId: string;
  /** ID del profesor que realiza la consulta. */
  ProfessorId: number;
};
