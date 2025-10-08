import type { CriteriaDTO, StringQueryDTO } from "../common";

/**
 * Define criterios de busqueda de la relación entre clase
 * y profesor
 */
export type WithProfessor = {
  /** Filtro por ID del profesor asociado a la clase */
  id: number;
  /** Filtro de profesores dueños de una clase */
  isOwner?: boolean;
};

/**
 * Define criterios de busqueda de la relación entre clase
 * y estudiante
 */
export type WithStudent = {
  /** Filtro por ID del estudiante asociado a la clase */
  id: number;
  /** Filtro clases ocultas clase */
  hidden?: boolean;
};

/**
 * Define los criterios de búsqueda específicos para clases académicas
 * @extends CriteriaDTO
 */
export type ClassCriteriaDTO = CriteriaDTO & {
  /** Filtro por estado activo/inactivo de la clase */
  active?: boolean;
  /** Criterios de búsqueda por nombre de la clase */
  className?: StringQueryDTO;
  /** Criterios de búsqueda por materia o asignatura */
  subject?: StringQueryDTO;
  /** Criterios de búsqueda por sección o grupo */
  section?: StringQueryDTO;
  /** Filtro por ID del profesor asociado a la clase */
  withProfessor?: WithProfessor;
  /** Filtro por ID del estudiante asociado a la clase */
  withStudent?: WithStudent;
};
