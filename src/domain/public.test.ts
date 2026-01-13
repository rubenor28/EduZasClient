import type { AnyPublicQuestion } from "./public.questions";

export type PublicTest = {
  id: string;
  active: boolean;
  title: string;
  color: string;
  content: AnyPublicQuestion[];
  timeLimitMinutes: number;
  professorId: number;
};
