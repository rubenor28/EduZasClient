import axios from "axios";
import { VITE_API_URL } from "config";
import type { FieldError } from "entities/common/entities";
import type { User, UserCredentials } from "entities/users/entities";
import { Err, Ok, type Result } from "ts-results";

const authEndpoint = `${VITE_API_URL}/auth`;

export const authService = {
  async createUser(credentials: UserCredentials): Promise<Result<User, FieldError[]>> {
    const response = await axios.post(authEndpoint, credentials, {
      validateStatus: (status) => status <= 500,
    });

    if (response.status >= 400) {
      return Err(response.data.error as FieldError[]);
    }

    return Ok(response.data.user as User);
  },
};
