import type { QuestionAnswer } from "@domain";

export type AnswerUpdateStudent = {
  userId: number;
  testId: string;
  classId: string;
  content: Record<string, QuestionAnswer>;
};
