import type { Criteria, StringQuery } from "./common";
import type { Block } from "@blocknote/core";

export type Resource = {
  id: string;
  active: boolean;
  title: string;
  content: Block[];
  professorId: number;
};

export type NewResource = {
  title: string;
  content: Block[];
  professorId: number;
};

export type ResourceUpdate = {
  id: string;
  active: boolean;
  title:string;
  content: Block[];
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
};

export type ClassResourceAssociation = {
  resourceId: string;
  classId: string;
  className: string;
  isAssociated: boolean;
  isHidden: boolean;
};

export type ClassResourceAssociationCriteria = Criteria  & {
  professorId: number;
  resourceId: string;
};

export type ClassResource = {
    classId: string;
    resourceId: string;
    hidden: boolean;
}
