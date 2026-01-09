import type { Question } from "./questions";

export type PublicOption = {
  id: string;
  text: string;
};

export type PublicQuestion = Question & { id: string };

export type PublicConceptRelationQuestion = PublicQuestion & {
  columnA: string[];
  columnB: string[];
};

export type PublicMultipleChoiseQuestion = PublicQuestion & {
  options: PublicOption[];
};

export type PublicMultipleSelectionQuestion = PublicQuestion & {
  options: PublicOption[];
};

export type PublicOpenQuestion = PublicQuestion;

export type PublicOrderingQuestion = PublicQuestion & {
  items: string[];
};

export type AnyPublicQuestion =
  | PublicConceptRelationQuestion
  | PublicMultipleChoiseQuestion
  | PublicMultipleSelectionQuestion
  | PublicOpenQuestion
  | PublicOrderingQuestion;
