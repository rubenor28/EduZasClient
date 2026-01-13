import type { AnyPublicQuestion } from "./public.questions";
import { type ConceptPair, QuestionTypes } from "./questions";

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

export function defaultQuestionAnswerFabric(
  question: AnyPublicQuestion,
): AnyQuestionAnswer {
  switch (question.type) {
    case QuestionTypes.MultipleChoise:
      return { selectedOption: question.options[0].id };

    case QuestionTypes.MultipleSelection:
      return { selectedOptions: [] };

    case QuestionTypes.Ordering:
      return { sequence: { ...question.items } };

    case QuestionTypes.Open:
      return { text: "" };

    case QuestionTypes.ConceptRelation:
      let pairs: ConceptPair[] = [];

      for (let i = 0; i < question.columnA.length; i++) {
        pairs.push({
          conceptA: question.columnA[i],
          conceptB: question.columnB[i],
        });
      }

      return { answeredPairs: pairs };
  }
}
