import { type ConceptPair, QuestionTypes } from "@domain";

export type BaseGrade = {
  totalPoints: number;
  points: number;
  manualGrade: boolean | null;
};

export type Grade = BaseGrade &
  (
    | {
        readonly type: QuestionTypes.Open;
        title: string;
        answer: string;
        feedback?: string;
      }
    | {
        readonly type: QuestionTypes.MultipleChoise;
        title: string;
        options: Record<string, string>;
        correctOption: string;
        selectedOption: string | null;
      }
    | {
        readonly type: QuestionTypes.MultipleSelection;
        title: string;
        options: Record<string, string>;
        correctOptions: string[];
        answeredOptions: string[];
      }
    | {
        readonly type: QuestionTypes.Ordering;
        title: string;
        sequence: string[];
        answeredSequence: string[];
      }
    | {
        readonly type: QuestionTypes.ConceptRelation;
        title: string;
        pairs: ConceptPair[];
        answeredPairs: ConceptPair[];
      }
  );

export type GradeVariant<T extends QuestionTypes> = Extract<Grade, { type: T }>;

export type AnswerGrade = {
  studentId: number;
  points: number;
  totalPoints: number;
  gradeDetails: Grade[];
};

export type AnswerGradeDetail = AnswerGrade & {
  testId: string;
  className: string;
  testTitle: string;
  professorName: string;
  studentName: string;
  score: number;
  approved: boolean;
  date: string;
};
