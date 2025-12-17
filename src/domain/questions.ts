/**
 * Representa la estructura base de cualquier tipo de pregunta.
 */
export type Question = {
  title: string;
  imageUrl: string | null;
};

export enum QuestionTypes {
  MultipleChoise = "multiple-choise",
  MultipleSelection = "multiple-selection",
  Ordering = "ordering",
  Open = "open",
  ConceptRelation = "concept-relation",
}

/**
 * Representa una pregunta abierta.
 */
export type OpenQuestion = Question & {
  readonly type: QuestionTypes.Open;
};

/**
 * Representa una pregunta de opción múltiple con una única respuesta correcta.
 */
export type MultipleChoiseQuestion = Question & {
  readonly type: QuestionTypes.MultipleChoise;
  options: Record<string, string>;
  correctOption: string;
};

/**
 * Representa una pregunta de selección múltiple con varias respuestas correctas.
 */
export type MultipleSelectionQuestion = Question & {
  readonly type: QuestionTypes.MultipleSelection;
  options: Record<string, string>;
  correctOptions: string[];
};

/**
 * Representa una pregunta de ordenar una secuencia.
 */
export type OrderingQuestion = Question & {
  readonly type: QuestionTypes.Ordering;
  sequence: string[];
};

/**
 * Define un par de conceptos para ser relacionados.
 */
export type ConceptPair = {
  conceptA: string;
  conceptB: string;
};

/**
 * Representa una pregunta de relacionar conceptos.
 */
export type ConceptRelationQuestion = Question & {
  readonly type: QuestionTypes.ConceptRelation;
  concepts: Record<string, ConceptPair>;
};

/**
 * Unión de todos los tipos de preguntas posibles para un manejo polimórfico.
 * La propiedad 'type' actúa como discriminador.
 */
export type AnyQuestion =
  | OpenQuestion
  | MultipleChoiseQuestion
  | MultipleSelectionQuestion
  | OrderingQuestion
  | ConceptRelationQuestion;
