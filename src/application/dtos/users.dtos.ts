import type { Criteria, StringQuery } from "./common";

export type NewUser = {
  firstName: string;
  fatherLastname: string;
  email: string;
  password: string;
  motherLastname?: string;
  midName?: string;
  role: number;
};

export type UpdateUser = {
  id: number;
  active: boolean;
  role: number;
  firstName: string;
  fatherLastname: string;
  email: string;
  password: string | null;
  midName?: string;
  motherLastname?: string;
};

export type UserCriteria = Criteria & {
  active?: boolean;
  role?: number;
  firstName?: StringQuery;
  midName?: StringQuery;
  fatherLastname?: StringQuery;
  motherLastname?: StringQuery;
  email?: StringQuery;
  password?: StringQuery;
  createdAt?: Date;
  modifiedAt?: Date;
};
