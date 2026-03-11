import { QuestionTypes, type BaseQuestion } from "./questions";

/**
 * Representa una opción de respuesta en una pregunta pública.
 */
export type PublicOption = {
  /** Identificador único de la opción. */
  id: string;
  /** Texto de la opción. */
  text: string;
};

/**
 * Estructura base para cualquier tipo de pregunta pública.
 */
export type BasePublicQuestion = BaseQuestion & { id: string };

/**
 * Unión de todos los tipos de preguntas públicas soportados.
 */
export type PublicQuestion = BasePublicQuestion &
  (
    | {
        readonly type: QuestionTypes.ConceptRelation;
        columnA: string[];
        columnB: string[];
      }
    | {
        readonly type: QuestionTypes.MultipleChoise;
        options: PublicOption[];
      }
    | {
        readonly type: QuestionTypes.MultipleSelection;
        options: PublicOption[];
      }
    | {
        readonly type: QuestionTypes.Open;
      }
    | {
        readonly type: QuestionTypes.Ordering;
        items: string[];
      }
  );

/**
 * Helper para extraer una variante específica de pregunta pública por su tipo.
 */
export type PublicQuestionVariant<T extends QuestionTypes> = Extract<
  PublicQuestion,
  { type: T }
>;
