import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "services/auth.service";
import { mapFieldErrorsToFieldMessageMapFromKeys } from "services";
import { Alert, AlertType, FieldWrapper, FormInput } from "components";

import {
  USER_CREDENTIALS_KEYS,
  type UserCredentials,
} from "entities/users/entities/user.credentials";

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await authService.login(credentials);

    try {
      if (result.err) {
        console.log(`Error de auth service: ${result.val}`);
        const inputErrs =
          mapFieldErrorsToFieldMessageMapFromKeys<UserCredentials>(
            result.val,
            USER_CREDENTIALS_KEYS,
          );

        setFormState({ state: "input_error", ...inputErrs });
        return;
      }

      setFormState({ state: "success" });
      navigate("/");
    } catch (error) {
      console.error(error);
      setFormState({ state: "unexpected_error" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form
      className="content-card-white"
      aria-labelledby="register-legend"
      onSubmit={handleSubmit}
    >
      <a href="/sign-up">
        <legend className="register-legend">Edu-zas</legend>
      </a>

      <div className="vertical-group">
        <FieldWrapper
          alert={
            formState.state === "input_error" &&
            formState.email && (
              <Alert
                className="text-xs"
                type={AlertType.WARNING}
                message={formState.email}
              />
            )
          }
        >
          <FormInput<UserCredentials>
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />
        </FieldWrapper>

        <FieldWrapper
          alert={
            formState.state === "input_error" &&
            formState.password && (
              <Alert
                className="text-xs"
                type={AlertType.WARNING}
                message={formState.password}
              />
            )
          }
        >
          <FormInput<UserCredentials>
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={handleChange}
          />
        </FieldWrapper>
      </div>

      {formState.state === "unexpected_error" && (
        <Alert
          className="text-xs"
          type="error"
          message="Ocurrió un error, intente más tarde"
        />
      )}

      {formState.state === "success" && (
        <Alert
          className="text-xs"
          type="error"
          message="Se registró correctamente"
        />
      )}

      <a
        href="/sign-up"
        className="text-blue-600 hover:text-blue-600 visited:text-blue-600 active:text-blue-600"
      >
        ¿Aún no tienes una cuenta? Regístrate
      </a>

      <div className="flex justify-end">
        <button type="submit" className="submit-button">
          Iniciar sesión
        </button>
      </div>
    </form>
  );
}
