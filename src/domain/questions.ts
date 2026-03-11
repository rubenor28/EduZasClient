/**
 * Representa la estructura base de cualquier tipo de pregunta.
 */
export type BaseQuestion = {
  /** Título o enunciado de la pregunta. */
  title: string;
  /** URL opcional de una imagen asociada a la pregunta. */
  imageUrl?: string;
};

/**
 * Tipos de preguntas soportados por el sistema.
 */
export enum QuestionTypes {
  /** Opción múltiple con una única respuesta correcta. */
  MultipleChoise = "multiple-choise",
  /** Selección múltiple con una o varias respuestas correctas. */
  MultipleSelection = "multiple-selection",
  /** Ordenamiento de una secuencia de elementos. */
  Ordering = "ordering",
  /** Pregunta abierta de respuesta libre. */
  Open = "open",
  /** Relación de pares de conceptos. */
  ConceptRelation = "concept-relation",
}

/**
 * Define un par de conceptos relacionados para preguntas de relación.
 */
export type ConceptPair = {
  /** Concepto de la primera columna. */
  conceptA: string;
  /** Concepto de la segunda columna relacionado con el primero. */
  conceptB: string;
};

/**
 * Unión de todos los tipos de preguntas con su contenido y respuestas correctas.
 */
export type Question = BaseQuestion &
  (
    | { readonly type: QuestionTypes.Open }
    | {
        readonly type: QuestionTypes.MultipleChoise;
        options: Record<string, string>;
        correctOption: string;
      }
    | {
        readonly type: QuestionTypes.MultipleSelection;
        options: Record<string, string>;
        correctOptions: string[];
      }
    | {
        readonly type: QuestionTypes.MultipleSelection;
        options: Record<string, string>;
        correctOptions: string[];
      }
    | {
        readonly type: QuestionTypes.Ordering;
        sequence: string[];
      }
    | {
        readonly type: QuestionTypes.ConceptRelation;
        concepts: ConceptPair[];
      }
  );

/**
 * Helper para extraer una variante específica de pregunta por su tipo.
 */
export type QuestionVariant<T extends QuestionTypes> = Extract<
  Question,
  { type: T }
>;
