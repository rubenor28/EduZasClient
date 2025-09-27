import { type UserCredentialsDTO } from "@application";
import { Alert, AlertType, FieldWrapper, FormInput } from "@components";
import { authService } from "@dependencies";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

type InputError = {
  email?: string;
  password?: string;
};

type FormState =
  | { state: "idle" | "success" | "unexpected_error" }
  | ({ state: "input_error" } & InputError);

export function LogInForm() {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState<UserCredentialsDTO>({
    email: "",
    password: "",
  });

  const [formState, setFormState] = useState<FormState>({ state: "idle" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    authService.login(credentials).then((result) => {
      console.log("AuthService result:", result);

      if (result.err) {
        const inputErrs: InputError = result.val.reduce(
          (acc, curr) => ({ ...acc, [curr.field]: curr.message }),
          {},
        );

        setFormState({ state: "input_error", ...inputErrs });
        return;
      }

      setFormState({ state: "success" });
      navigate("/");
    });
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
          <FormInput<UserCredentialsDTO>
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
          <FormInput<UserCredentialsDTO>
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
