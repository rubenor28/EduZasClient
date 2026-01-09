import type { AnyQuestionAnswer } from "./question.answers";

export type AnswerContent = Record<string, AnyQuestionAnswer>;

export type AnswerMetadata = {
  manualMarkAsCorrect: string[];
};

export type Answer = {
  userId: number;
  testId: string;
  classId: string;
  content: AnswerContent;
  metadata: AnswerMetadata;
};
