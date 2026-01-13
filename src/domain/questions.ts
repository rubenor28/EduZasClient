/**
 * Representa la estructura base de cualquier tipo de pregunta.
 */
export type BaseQuestion = {
  title: string;
  imageUrl?: string;
};

export enum QuestionTypes {
  MultipleChoise = "multiple-choise",
  MultipleSelection = "multiple-selection",
  Ordering = "ordering",
  Open = "open",
  ConceptRelation = "concept-relation",
}

/**
 * Define el par de conceptos relacionados.
 */
export type ConceptPair = {
  conceptA: string;
  conceptB: string;
};

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

export type QuestionVariant<T extends QuestionTypes> = Extract<
  Question,
  { type: T }
>;
