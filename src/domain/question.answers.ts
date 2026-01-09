import { QuestionTypes, type ConceptPair } from "./questions";

export type QuestionAnswer = {};

export type OpenQuestionAnswer = QuestionAnswer & {
  readonly type: QuestionTypes.Open;
  text: string;
};

export type MultipleChoiseQuestionAnswer = QuestionAnswer & {
  readonly type: QuestionTypes.MultipleChoise;
  selectedOption: string;
};

export type MultipleSelectionQuestionAnswer = QuestionAnswer & {
  readonly type: QuestionTypes.MultipleSelection;
  selectedOptions: string[];
};

export type OrderingQuestionAnswer = QuestionAnswer & {
  readonly type: QuestionTypes.Ordering;
  sequence: string[];
};

export type ConceptRelationQuestionAnswer = QuestionAnswer & {
  readonly type: QuestionTypes.ConceptRelation;
  answeredPairs: ConceptPair[];
};

export type AnyQuestionAnswer =
  | OpenQuestionAnswer
  | MultipleChoiseQuestionAnswer
  | MultipleSelectionQuestionAnswer
  | OrderingQuestionAnswer
  | ConceptRelationQuestionAnswer;
