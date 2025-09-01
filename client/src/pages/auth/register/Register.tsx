import { useState } from "react";

import { Alert, FieldWrapper } from "components";
import { AlertType } from "components/Alert/AlertType";
import { RegisterInput } from "./components/Input";

import { NEW_USER_KEYS, type NewUser } from "entities/users/entities";
import { Gender } from "entities/users/enums";
import { userService, mapFieldErrorsToFieldMessageMapFromKeys } from "services";

import "./Register.css";

type InputError = Partial<Record<keyof NewUser, string>> & {
  matchingPassword?: string;
};

type PageState =
  | { state: "idle" | "success" | "unexpected_error" }
  | ({ state: "input_error" } & InputError);

// Register.tsx
export function Register() {
  const [newUser, setNewUser] = useState<NewUser>({
    email: "",
    fatherLastname: "",
    firstName: "",
    tuition: "",
    password: "",
  });

  const [pageState, setPageState] = useState<PageState>({ state: "idle" });

  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // validación local de coincidencia de contraseñas
    if ((newUser.password ?? "") !== confirmPassword) {
      setPageState({
        state: "input_error",
        matchingPassword: "Las contraseñas no coinciden",
      });
      return;
    }

    userService
      .createUser(newUser)
      .then((result) => {
        if (result.err) {
          const inputErrs = mapFieldErrorsToFieldMessageMapFromKeys<NewUser>(
            result.val,
            NEW_USER_KEYS,
          );

          setPageState({ state: "input_error", ...inputErrs });
          return;
        }

        setPageState({ state: "success" });
      })
      .catch(() => setPageState({ state: "unexpected_error" }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmPassword(e.target.value);

    setPageState((prev) =>
      prev.state === "input_error" ? { ...prev, password: undefined } : prev,
    );
  };

  const handleSelectGender = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setNewUser((prev) => ({
      ...prev,
      gender: e.target.value === "" ? undefined : (e.target.value as Gender),
    }));

  return (
    <form
      className="register-form"
      aria-labelledby="register-legend"
      onSubmit={handleSubmit}
    >
      <legend
        id="register-legend"
        className="text-3xl font-bold mb-4 text-center"
      >
        Edu-zas
      </legend>

      {/* Agrupamos matrícula y primer nombre */}
      <div className="field-group">
        <FieldWrapper
          alert={
            pageState.state === "input_error" &&
            pageState.tuition && (
              <Alert type={AlertType.WARNING} message={pageState.tuition} />
            )
          }
        >
          <RegisterInput
            name="tuition"
            placeholder="Matrícula"
            onChange={handleChange}
          />
        </FieldWrapper>

        <FieldWrapper
          alert={
            pageState.state === "input_error" &&
            pageState.firstName && (
              <Alert type={AlertType.WARNING} message={pageState.firstName} />
            )
          }
        >
          <RegisterInput
            name="firstName"
            placeholder="Primer nombre"
            onChange={handleChange}
          />
        </FieldWrapper>
      </div>

      {/* Agrupamos segundo nombre y apellido paterno */}
      <div className="field-group">
        <FieldWrapper
          alert={
            pageState.state === "input_error" &&
            pageState.midName && (
              <Alert type={AlertType.WARNING} message={pageState.midName} />
            )
          }
        >
          <RegisterInput
            name="midName"
            placeholder="Segundo nombre"
            onChange={handleChange}
          />
        </FieldWrapper>

        <FieldWrapper
          alert={
            pageState.state === "input_error" &&
            pageState.fatherLastname && (
              <Alert
                type={AlertType.WARNING}
                message={pageState.fatherLastname}
              />
            )
          }
        >
          <RegisterInput
            name="fatherLastname"
            placeholder="Apellido paterno"
            onChange={handleChange}
          />
        </FieldWrapper>
      </div>

      {/* Agrupamos apellido materno y género */}
      <div className="field-group">
        <FieldWrapper
          alert={
            pageState.state === "input_error" &&
            pageState.motherLastname && (
              <Alert
                type={AlertType.WARNING}
                message={pageState.motherLastname}
              />
            )
          }
        >
          <RegisterInput
            name="motherLastname"
            placeholder="Apellido materno"
            onChange={handleChange}
          />
        </FieldWrapper>

        <FieldWrapper
          alert={
            pageState.state === "input_error" &&
            pageState.gender && (
              <Alert type={AlertType.WARNING} message={pageState.gender} />
            )
          }
        >
          <select
            name="gender"
            className="input-base"
            value={newUser.gender ?? ""}
            onChange={handleSelectGender}
          >
            <option value="">Prefiero no decirlo</option>
            <option value={Gender.MALE}>Hombre</option>
            <option value={Gender.FEMALE}>Mujer</option>
            <option value={Gender.OTHER}>Otro</option>
          </select>
          <div className="mt-1 text-gray-400 text-sm">Género</div>
        </FieldWrapper>
      </div>

      {/* Correo y contraseña podrían ir cada uno en línea propia */}
      <div className="mb-4">
        <FieldWrapper
          alert={
            pageState.state === "input_error" &&
            pageState.email && (
              <Alert type={AlertType.WARNING} message={pageState.email} />
            )
          }
        >
          <RegisterInput
            type="email"
            name="email"
            placeholder="Correo"
            onChange={handleChange}
          />
        </FieldWrapper>
      </div>

      {/* Agrupamos contraseñas */}
      <div className="field-group">
        <FieldWrapper
          alert={
            pageState.state === "input_error" &&
            pageState.password && (
              <Alert type={AlertType.WARNING} message={pageState.password} />
            )
          }
        >
          <RegisterInput
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={handleChange}
          />
        </FieldWrapper>

        <FieldWrapper
          alert={
            pageState.state === "input_error" &&
            pageState.matchingPassword && (
              <Alert
                type={AlertType.WARNING}
                message={pageState.matchingPassword}
              />
            )
          }
        >
          <div className="relative">
            <input
              type="password"
              className="input-base"
              onChange={handleConfirmPasswordChange}
            />
            <div className="mt-1 text-gray-400 text-sm">
              Confirmar contraseña
            </div>
          </div>
        </FieldWrapper>
      </div>

      {pageState.state === "unexpected_error" && (
        <Alert type="error" message="Ocurrió un error, intente más tarde" />
      )}

      {pageState.state === "success" && (
        <Alert type="error" message="Se registró correctamente" />
      )}

      <div className="flex justify-end">
        <button type="submit" className="submit-button">
          Registrar
        </button>
      </div>
    </form>
  );
}
