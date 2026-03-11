import type { QuestionAnswer } from "@domain";

/**
 * DTO para la actualización de las respuestas de un estudiante.
 */
export type AnswerUpdateStudent = {
  /** ID del estudiante. */
  userId: number;
  /** ID de la evaluación. */
  testId: string;
  /** ID de la clase asociada. */
  classId: string;
  /** Diccionario de respuestas por ID de pregunta. */
  content: Record<string, QuestionAnswer>;
};
