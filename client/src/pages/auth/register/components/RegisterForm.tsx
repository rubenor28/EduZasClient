import { useState } from "react";

import { Alert, FieldWrapper } from "components";
import { AlertType } from "components/Alert/AlertType";
import { RegisterInput } from "./Input";

import { NEW_USER_KEYS, type NewUser } from "entities/users/entities";
import { Gender } from "entities/users/enums";
import { userService, mapFieldErrorsToFieldMessageMapFromKeys } from "services";

import "../Register.css";
import { useNavigate } from "react-router-dom";

type InputError = Partial<Record<keyof NewUser, string>> & {
  matchingPassword?: string;
};

type FormState =
  | { state: "idle" | "success" | "unexpected_error" }
  | ({ state: "input_error" } & InputError);

// Register.tsx
export function RegisterForm() {
  const navigate = useNavigate();

  const [newUser, setNewUser] = useState<NewUser>({
    email: "",
    fatherLastname: "",
    firstName: "",
    tuition: "",
    password: "",
  });

  const [formState, setFormState] = useState<FormState>({ state: "idle" });

  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const {
      tuition,
      email,
      firstName,
      midName,
      motherLastname,
      fatherLastname,
      password,
      gender,
    } = newUser;

    // validación local de coincidencia de contraseñas
    if ((password ?? "") !== confirmPassword) {
      setFormState({
        state: "input_error",
        matchingPassword: "Las contraseñas no coinciden",
      });
      return;
    }

    userService
      .createUser({
        tuition: tuition.trim(),
        email: email.trim(),
        firstName: firstName.trim(),
        midName: !midName || midName === "" ? undefined : midName.trim(),
        fatherLastname: fatherLastname.trim(),
        motherLastname:
          !motherLastname || motherLastname === ""
            ? undefined
            : motherLastname.trim(),
        gender,
        password,
      })
      .then((result) => {
        if (result.err) {
          const inputErrs = mapFieldErrorsToFieldMessageMapFromKeys<NewUser>(
            result.val,
            NEW_USER_KEYS,
          );

          setFormState({ state: "input_error", ...inputErrs });
          return;
        }

        setFormState({ state: "success" });
        navigate("/");
      })
      .catch(() => setFormState({ state: "unexpected_error" }));
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

    setFormState((prev) =>
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
      <legend className="register-legend">Edu-zas</legend>

      <div className="field-group">
        <FieldWrapper
          alert={
            formState.state === "input_error" &&
            formState.tuition && (
              <Alert type={AlertType.WARNING} message={formState.tuition} />
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
            formState.state === "input_error" &&
            formState.firstName && (
              <Alert type={AlertType.WARNING} message={formState.firstName} />
            )
          }
        >
          <RegisterInput
            name="firstName"
            placeholder="Primer nombre"
            onChange={handleChange}
          />
        </FieldWrapper>

        <FieldWrapper
          alert={
            formState.state === "input_error" &&
            formState.midName && (
              <Alert type={AlertType.WARNING} message={formState.midName} />
            )
          }
        >
          <RegisterInput
            name="midName"
            placeholder="Segundo nombre"
            onChange={handleChange}
          />
        </FieldWrapper>
      </div>

      <div className="field-group">
        <FieldWrapper
          alert={
            formState.state === "input_error" &&
            formState.fatherLastname && (
              <Alert
                type={AlertType.WARNING}
                message={formState.fatherLastname}
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

        <FieldWrapper
          alert={
            formState.state === "input_error" &&
            formState.motherLastname && (
              <Alert
                type={AlertType.WARNING}
                message={formState.motherLastname}
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
            formState.state === "input_error" &&
            formState.gender && (
              <Alert type={AlertType.WARNING} message={formState.gender} />
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
          <div className="field-placeholder">Género</div>
        </FieldWrapper>
      </div>

      <div className="field-group">
        <FieldWrapper
          alert={
            formState.state === "input_error" &&
            formState.email && (
              <Alert type={AlertType.WARNING} message={formState.email} />
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

        <FieldWrapper
          alert={
            formState.state === "input_error" &&
            formState.password && (
              <Alert type={AlertType.WARNING} message={formState.password} />
            )
          }
        >
          <RegisterInput
            hint="Hola"
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={handleChange}
          />
        </FieldWrapper>

        <FieldWrapper
          alert={
            formState.state === "input_error" &&
            formState.matchingPassword && (
              <Alert
                type={AlertType.WARNING}
                message={formState.matchingPassword}
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

      {formState.state === "unexpected_error" && (
        <Alert type="error" message="Ocurrió un error, intente más tarde" />
      )}

      {formState.state === "success" && (
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
