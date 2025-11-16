import { API_URL } from "./EnvVars";
import type { AuthService, ClassService } from "@application";

import {
  createFetchAuthService,
  createFetchClassService,
} from "@infrastructure-fetch";
import { useAppStore } from "./Stores";

export const authService: AuthService = createFetchAuthService(API_URL, useAppStore);
export const classService: ClassService = createFetchClassService(API_URL, useAppStore);
