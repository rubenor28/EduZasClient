import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mapFieldErrorsToFieldMessageMapFromKeys } from "services";
import { Alert, AlertType, FieldWrapper, FormInput } from "components";
import { appState } from "state/app.state";
import {
  USER_CREDENTIALS_KEYS,
  type UserCredentials,
} from "entities/users/entities/user.credentials";
import { authService } from "services/auth.service";

type InputError = {
  email?: string;
  password?: string;
};

type FormState =
  | { state: "idle" | "success" | "unexpected_error" }
  | ({ state: "input_error" } & InputError);

export function LogInForm() {
  const { login } = appState();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState<UserCredentials>({
    email: "",
    password: "",
  });

  const [formState, setFormState] = useState<FormState>({ state: "idle" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await authService.createUser(credentials);

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

      login(result.val);
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
      <legend className="register-legend">Edu-zas</legend>

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

      <div className="flex justify-end">
        <button type="submit" className="submit-button">
          Registrar
        </button>
      </div>
    </form>
  );
}
