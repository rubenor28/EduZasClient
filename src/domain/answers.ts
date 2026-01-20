import type { QuestionAnswer } from "./question.answers";

export type AnswerContent = Record<string, QuestionAnswer>;

export type AnswerMetadata = {
  manualMarkAsCorrect: string[];
};

export type Answer = {
  userId: number;
  testId: string;
  classId: string;
  tryFinished: boolean;
  graded: boolean;
  content: AnswerContent;
  metadata: AnswerMetadata;
};
