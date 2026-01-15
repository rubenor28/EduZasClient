import type { PublicQuestion } from "./public.questions";

export type PublicTest = {
  id: string;
  active: boolean;
  title: string;
  color: string;
  content: PublicQuestion[];
  deadline?: string;
  professorId: number;
};
