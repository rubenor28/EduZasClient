import { QuestionTypes, type BaseQuestion } from "./questions";

export type PublicOption = {
  id: string;
  text: string;
};

export type BasePublicQuestion = BaseQuestion & { id: string };

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

export type PublicQuestionVariant<T extends QuestionTypes> = Extract<
  PublicQuestion,
  { type: T }
>;
