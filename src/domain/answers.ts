import type { QuestionAnswer } from "./question.answers";

/**
 * Contenido de una respuesta, mapeando IDs de pregunta a sus respectivas respuestas.
 */
export type AnswerContent = Record<string, QuestionAnswer>;

/**
 * Metadatos de la respuesta, como marcas manuales de corrección.
 */
export type AnswerMetadata = {
  manualMarkAsCorrect: string[];
};

/**
 * Identificador único para una respuesta (relación usuario-test-clase).
 */
export type AnswerId = {
  userId: number;
  testId: string;
  classId: string;
};

/**
 * Representa una respuesta completa a una evaluación.
 */
export type Answer = AnswerId & {
  tryFinished: boolean;
  graded: boolean;
  content: AnswerContent;
  metadata: AnswerMetadata;
};

/**
 * Posibles estados de calificación de una respuesta.
 */
export type AnswerGradeStatus =
  | { status: "idle" }
  | { status: "waiting-grade" }
  | { status: "graded" };
