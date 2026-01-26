import { type ConceptPair, QuestionTypes } from "@domain";

/**
 * Representa la estructura base de cualquier tipo de calificación (Grade).
 */
export type BaseGrade = {
  readonly questionId: string;
  readonly title: string;
  readonly points: number;
  readonly totalPoints: number;
  readonly manualGrade: boolean | null;
};

/**
 * Unión de todos los tipos de calificación (Grade).
 */
export type Grade = BaseGrade &
  (
    | {
        readonly type: QuestionTypes.ConceptRelation;
        readonly pairs: ConceptPair[];
        readonly answeredPairs: ConceptPair[];
      }
    | {
        readonly type: QuestionTypes.MultipleChoise;
        readonly options: Record<string, string>;
        readonly correctOption: string;
        readonly selectedOption: string | null;
      }
    | {
        readonly type: QuestionTypes.MultipleSelection;
        readonly options: Record<string, string>;
        readonly correctOptions: string[];
        readonly answeredOptions: string[];
      }
    | {
        readonly type: QuestionTypes.Open;
        readonly text: string | null;
      }
    | {
        readonly type: QuestionTypes.Ordering;
        readonly sequence: string[];
        readonly answeredSequence: string[];
        readonly correctIndexes: number;
      }
  );

/**
 * Helper para extraer una variante de Grade por su tipo.
 */
export type GradeVariant<T extends QuestionTypes> = Extract<Grade, { type: T }>;

/**
 * Representa la calificación de un test completo.
 */
export type TestGrade = {
  readonly points: number;
  readonly totalPoints: number;
  readonly gradeDetails: Grade[];
};

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
