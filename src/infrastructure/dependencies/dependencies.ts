import type { AuthService } from "@application";
import { createFetchAuthService } from "../fetch";

export const API_URL = "http://localhost:5018";
export const userService: AuthService = createFetchAuthService(API_URL);
