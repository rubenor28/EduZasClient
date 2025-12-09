import type { OutputData } from "@editorjs/editorjs";
import type { Criteria, StringQuery } from "./common";

/**
 * DTO para el resumen de una evaluación.
 * Contiene información esencial para listar evaluaciones.
 */
export type TestSummary = {
  /** Identificador único de la evaluación. */
  id: string;
  /** Título de la evaluación. */
  title: string;
  /** Indica si la evaluación está activa (no archivada). */
  active: boolean;
  /** Fecha de la última modificación. */
  modifiedAt: string;
};

/**
 * DTO para la creación de una nueva evaluación.
 */
export type NewTest = {
  /** Título de la evaluación. */
  title: string;
  /** Contenido de la evaluación en formato de bloques. */
  content: OutputData;
  /** Límite de tiempo en minutos (opcional). */
  timeLimitMinutes?: number;
  /** ID del profesor que crea la evaluación. */
  professorId: number;
};

/**
 * DTO para la actualización de una evaluación existente.
 */
export type TestUpdate = {
  /** Identificador único de la evaluación a actualizar. */
  id: string;
  /** Nuevo título de la evaluación. */
  title: string;
  /** Nuevo contenido de la evaluación en formato de bloques. */
  content: OutputData;
  /** Nuevo límite de tiempo en minutos (opcional). */
  timeLimitMinutes?: number;
  /** ID del profesor propietario. */
  professorId: number;
  /** Estado activo de la evaluación. */
  active: boolean;
};

/**
 * DTO para especificar criterios de búsqueda de evaluaciones.
 */
export type TestCriteria = Criteria & {
  /** Filtra por título de la evaluación. */
  title?: StringQuery;
  /** Filtra por estado activo o inactivo. */
  active?: boolean;
  /** Filtra por límite de tiempo. */
  timeLimitMinutes?: number;
  /** Filtra por el ID del profesor. */
  professorId?: number;
  /** Filtra por el ID de la clase en la que está asignada. */
  assignedInClass?: string;
};

/**
 * DTO para representar el estado de asociación entre una evaluación y una clase.
 */
export type ClassTestAssociation = {
  classId: string;
  className: string;
  isAssociated: boolean;
  isVisible: boolean;
};

/**
 * DTO para los criterios de búsqueda de asociaciones entre evaluación y clase.
 */
export type ClassTestAssociationCriteria = Criteria & {
  professorId: number;
  testId: string;
};
