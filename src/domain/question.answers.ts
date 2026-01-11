import { type ConceptPair } from "./questions";

export type QuestionAnswer = {};

export type OpenQuestionAnswer = QuestionAnswer & {
  text: string;
};

export type MultipleChoiseQuestionAnswer = QuestionAnswer & {
  selectedOption: string;
};

export type MultipleSelectionQuestionAnswer = QuestionAnswer & {
  selectedOptions: string[];
};

export type OrderingQuestionAnswer = QuestionAnswer & {
  sequence: string[];
};

export type ConceptRelationQuestionAnswer = QuestionAnswer & {
  answeredPairs: ConceptPair[];
};

export type AnyQuestionAnswer =
  | OpenQuestionAnswer
  | MultipleChoiseQuestionAnswer
  | MultipleSelectionQuestionAnswer
  | OrderingQuestionAnswer
  | ConceptRelationQuestionAnswer;
