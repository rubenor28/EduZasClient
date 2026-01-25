import type { QuestionAnswer } from "./question.answers";

export type AnswerContent = Record<string, QuestionAnswer>;

export type AnswerMetadata = {
  manualMarkAsCorrect: string[];
};

export type AnswerId = {
  userId: number;
  testId: string;
  classId: string;
};

export type Answer = AnswerId & {
  tryFinished: boolean;
  graded: boolean;
  content: AnswerContent;
  metadata: AnswerMetadata;
};

export type AnswerGradeStatus =
  | { status: "idle" }
  | { status: "waiting-grade" }
  | { status: "graded" };
