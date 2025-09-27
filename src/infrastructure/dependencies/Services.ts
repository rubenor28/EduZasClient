import { createFetchAuthService } from "@infrastructure-fetch";
import { API_URL } from "./EnvVars";
import type { AuthService } from "@application";

export const authService: AuthService = createFetchAuthService(API_URL);
