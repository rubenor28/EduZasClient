import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mapFieldErrorsToFieldMessageMapFromKeys, userService } from "services";
import { Alert, AlertType, FormInput } from "components";
import type { UserCredentials } from "entities/users/entities/user.credentials";
import { authService } from "services/auth.service";

type InputError = {
  email?: string;
  password?: string;
};

type FormState =
  | { state: "idle" | "success" | "unexpected_error" }
  | ({ state: "input_error" } & InputError);

export function LogInForm() {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState<UserCredentials>({
    email: "",
    password: "",
  });

  const [formState, setFormState] = useState<FormState>({ state: "idle" });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    authService.createUser(credentials).then((result) => {
      const inputErrs = mapFieldErrorsToFieldMessageMapFromKeys<UserCredentials>(
        result.val,
        NEW_USER_KEYS,
      );
    });
  };

  return (
    <>
      <h1>Hello world</h1>
    </>
  );
}
