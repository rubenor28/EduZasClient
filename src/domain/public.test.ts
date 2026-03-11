import type { PublicQuestion } from "./public.questions";

/**
 * Representa una evaluación en su formato público (para estudiantes).
 */
export type PublicTest = {
  /** Identificador único de la evaluación. */
  id: string;
  /** Indica si la evaluación está activa. */
  active: boolean;
  /** Título de la evaluación. */
  title: string;
  /** Color asociado a la evaluación para la UI. */
  color: string;
  /** Lista de preguntas públicas (sin respuestas correctas). */
  content: PublicQuestion[];
  /** Fecha límite opcional para completar la evaluación. */
  deadline?: string;
  /** ID del profesor que creó la evaluación. */
  professorId: number;
};
