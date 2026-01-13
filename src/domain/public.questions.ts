import type { Question, QuestionTypes } from "./questions";

export type PublicOption = {
  id: string;
  text: string;
};

export type PublicQuestion = Question & {
  id: string;
};

export type PublicConceptRelationQuestion = PublicQuestion & {
  readonly type: QuestionTypes.ConceptRelation;
  columnA: string[];
  columnB: string[];
};

export type PublicMultipleChoiseQuestion = PublicQuestion & {
  readonly type: QuestionTypes.MultipleChoise;
  options: PublicOption[];
};

export type PublicMultipleSelectionQuestion = PublicQuestion & {
  readonly type: QuestionTypes.MultipleSelection;
  options: PublicOption[];
};

export type PublicOpenQuestion = PublicQuestion & {
  readonly type: QuestionTypes.Open;
};

export type PublicOrderingQuestion = PublicQuestion & {
  readonly type: QuestionTypes.Ordering;
  items: string[];
};

export type AnyPublicQuestion =
  | PublicConceptRelationQuestion
  | PublicMultipleChoiseQuestion
  | PublicMultipleSelectionQuestion
  | PublicOpenQuestion
  | PublicOrderingQuestion;
