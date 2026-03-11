import { type ConceptPair, QuestionTypes } from "@domain";

/**
 * Representa la estructura base de cualquier tipo de calificación (Grade).
 */
export type BaseGrade = {
  /** ID de la pregunta calificada. */
  readonly questionId: string;
  /** Título de la pregunta. */
  readonly title: string;
  /** Puntos obtenidos en esta pregunta. */
  readonly points: number;
  /** Puntos totales posibles para esta pregunta. */
  readonly totalPoints: number;
  /** Indica si la calificación fue asignada manualmente (true/false) o automática (null). */
  readonly manualGrade: boolean | null;
};

/**
 * Unión de todos los tipos de calificación (Grade), incluyendo detalles específicos por tipo de pregunta.
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
 * Representa el resumen de calificación de una evaluación completa.
 */
export type TestGrade = {
  /** Suma total de puntos obtenidos. */
  readonly points: number;
  /** Suma total de puntos posibles. */
  readonly totalPoints: number;
  /** Detalle de calificación pregunta por pregunta. */
  readonly gradeDetails: Grade[];
};

/**
 * Representa la calificación de la respuesta de un estudiante.
 */
export type AnswerGrade = {
  /** ID del estudiante calificado. */
  studentId: number;
  /** Puntos obtenidos. */
  points: number;
  /** Puntos totales posibles. */
  totalPoints: number;
  /** Lista de calificaciones detalladas por pregunta. */
  gradeDetails: Grade[];
};

/**
 * Representa la información completa y detallada de la calificación de una respuesta.
 */
export type AnswerGradeDetail = AnswerGrade & {
  /** ID de la evaluación. */
  testId: string;
  /** Nombre de la clase. */
  className: string;
  /** Título de la evaluación. */
  testTitle: string;
  /** Nombre del profesor. */
  professorName: string;
  /** Nombre del estudiante. */
  studentName: string;
  /** Calificación final (0-100). */
  score: number;
  /** Indica si el estudiante aprobó. */
  approved: boolean;
  /** Fecha de la calificación. */
  date: string;
};
