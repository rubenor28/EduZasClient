import type { UserDomain } from "@domain";

export type LoggedInType = {
  type: "loggedIn";
  user: UserDomain;
};

export type LoggedOutType = {
  type: "loggedOut";
};

export type 
