import type { Criteria, StringQuery } from "./common";

export type Resource = {
  id: string;
  active: boolean;
  title: string;
  content: string;
  professorId: number;
}

export type NewResource = {
  title: string;
  content: string;
  professorId: number;
};

export type ResourceUpdate = {
  id: string;
  active: boolean;
  title: string;
  content: string;
  professorId: number;
};

export type ResourceCriteria = Criteria & {
  title?: StringQuery;
  active?: boolean;
  professorId?: number;
  classId?: string;
};

export type ResourceSummary = {
    id: string;
    active: boolean;
    title: string;
    professorId: number;
}
