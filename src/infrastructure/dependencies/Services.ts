import { API_URL } from "./EnvVars";
import type { AuthService, ClassService } from "@application";

import {
  createFetchAuthService,
  createFetchClassService,
} from "@infrastructure-fetch";

export const authService: AuthService = createFetchAuthService(API_URL);
export const classService: ClassService = createFetchClassService(API_URL);
