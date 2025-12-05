import type { StringQuery } from "./common";

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
  password: string;
  midName?: string;
  motherLastname?: string;
};

export type UserCriteria = {
  active?: boolean;
  role?: StringQuery;
  firstName?: StringQuery;
  midName?: StringQuery;
  fatherLastname?: StringQuery;
  motherLastname?: StringQuery;
  email?: StringQuery;
  password?: StringQuery;
  createdAt?: Date;
  modifiedAt?: Date;
};
