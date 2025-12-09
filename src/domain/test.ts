import { type OutputData } from "@editorjs/editorjs";

/**
 * Representa una entidad de Evaluación (Test).
 * Este tipo define la estructura de una evaluación en el sistema.
 */
export type Test = {
  /** Identificador único de la evaluación (GUID). */
  id: string;
  /** Indica si la evaluación está activa. */
  active: boolean;
  /** Título de la evaluación. */
  title: string;
  /** Contenido de la evaluación, estructurado como un array de bloques. */
  content: OutputData;
  /** Límite de tiempo en minutos para completar la evaluación (opcional). */
  timeLimitMinutes?: number;
  /** ID del profesor que creó la evaluación. */
  professorId: number;
  /** Fecha y hora de creación de la evaluación (ISO 8601). */
  createdAt: string;
  /** Fecha y hora de la última modificación (ISO 8601). */
  modifiedAt: string;
};
