import { type ConceptPair, QuestionTypes } from '@domain';

/**
 * Representa la estructura base de cualquier tipo de calificación (Grade).
 */
export type BaseGrade = {
  readonly points: number;
  readonly totalPoints: number;
  readonly manualGrade: boolean | null;
};

/**
 * Unión de todos los tipos de calificación (Grade).
 */
export type Grade = BaseGrade & (
  | {
      readonly type: QuestionTypes.ConceptRelation;
      readonly title: string;
      readonly pairs: ConceptPair[];
      readonly answeredPairs: ConceptPair[];
    }
  | {
      readonly type: QuestionTypes.MultipleChoise;
      readonly title: string;
      readonly options: Record<string, string>;
      readonly correctOption: string;
      readonly selectedOption: string | null;
    }
  | {
      readonly type: QuestionTypes.MultipleSelection;
      readonly title: string;
      readonly options: Record<string, string>;
      readonly correctOptions: string[];
      readonly answeredOptions: string[];
    }
  | {
      readonly type: QuestionTypes.Open;
      readonly manualGrade: boolean; // Sobreescritura de tipo
    }
  | {
      readonly type: QuestionTypes.Ordering;
      readonly title: string;
      readonly sequence: string[];
      readonly answeredSequence: string[];
      readonly correctIndexes: number;
    }
);

/**
 * Helper para extraer una variante de Grade por su tipo.
 */
export type GradeVariant<T extends QuestionTypes> = Extract<
  Grade,
  { type: T }
>;

/**
 * Representa la calificación de un test completo.
 */
export type TestGrade = {
    readonly points: number;
    readonly totalPoints: number;
    readonly gradeDetails: Grade[];
}
