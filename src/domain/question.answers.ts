import type { PublicQuestion, PublicQuestionVariant } from "./public.questions";
import { type ConceptPair, QuestionTypes } from "./questions";

export type QuestionAnswer =
  | { readonly type: QuestionTypes.Open; text: string }
  | { readonly type: QuestionTypes.MultipleChoise; selectedOption: string }
  | {
      readonly type: QuestionTypes.MultipleSelection;
      selectedOptions: string[];
    }
  | { readonly type: QuestionTypes.Ordering; sequence: string[] }
  | {
      readonly type: QuestionTypes.ConceptRelation;
      answeredPairs: ConceptPair[];
    };

export type QuestionAnswerVariant<T extends QuestionTypes> = Extract<
  QuestionAnswer,
  { type: T }
>;

export function defaultQuestionAnswer(question: PublicQuestion): QuestionAnswer;
export function defaultQuestionAnswer(question: PublicQuestionVariant<QuestionTypes.Open>): QuestionAnswerVariant<QuestionTypes.Open>;
export function defaultQuestionAnswer(question: PublicQuestionVariant<QuestionTypes.Ordering>): QuestionAnswerVariant<QuestionTypes.Ordering>;
export function defaultQuestionAnswer(question: PublicQuestionVariant<QuestionTypes.MultipleChoise>): QuestionAnswerVariant<QuestionTypes.MultipleChoise>;
export function defaultQuestionAnswer(question: PublicQuestionVariant<QuestionTypes.ConceptRelation>): QuestionAnswerVariant<QuestionTypes.ConceptRelation>;
export function defaultQuestionAnswer(question: PublicQuestionVariant<QuestionTypes.MultipleSelection>): QuestionAnswerVariant<QuestionTypes.MultipleSelection>;

export function defaultQuestionAnswer(
  question: PublicQuestionVariant<QuestionTypes>,
): QuestionAnswer {
  const { type } = question;

  if (type === QuestionTypes.MultipleChoise)
    return { type, selectedOption: question.options[0].id };

  if (type === QuestionTypes.MultipleSelection)
    return { type, selectedOptions: [] };

  if (type === QuestionTypes.Ordering)
    return { type, sequence: { ...question.items } };

  if (type === QuestionTypes.Open) return { type, text: "" };

  if (type === QuestionTypes.ConceptRelation) {
    let answeredPairs: ConceptPair[] = [];

    for (let i = 0; i < question.columnA.length; i++) {
      answeredPairs.push({
        conceptA: question.columnA[i],
        conceptB: question.columnB[i],
      });
    }

    return { type, answeredPairs };
  }

  throw Error(`QuestionAnswer ${type} not suported`);
}
