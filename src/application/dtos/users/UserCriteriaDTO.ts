import type { UserType } from "@domain";
import type { StringQueryDTO } from "@application";

export type UserCriteriaDTO = {
  active?: boolean;
  role?: UserType;
  firtName?: StringQueryDTO;
  midName?: StringQueryDTO;
  fatherLastName?: StringQueryDTO;
  motherLastName?: StringQueryDTO;
  email?: StringQueryDTO;
  createdAt?: Date;
  modifiedAt?: Date;
};
