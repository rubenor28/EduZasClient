import { useState } from "react";

import { Gender } from "entities/users/enums";
import { type NewUser, NEW_USER_KEYS } from "entities/users/entities";

import { mapFieldErrorsToFieldMessageMapFromKeys, userService } from "services";

import {
  FieldWrapper,
  Alert,
  AlertType,
  FormInput,
  FormSelect,
  type FormSelectOpts,
} from "components";

type InputError = Partial<Record<keyof NewUser, string>> & {
  matchingPassword?: string;
};

type FormState =
  | { state: "idle" | "success" | "unexpected_error" }
  | ({ state: "input_error" } & InputError);

// Register.tsx
export function RegisterForm() {
  const genderOptions: FormSelectOpts = [
    { label: "Prefiero no decirlo", value: "" },
    { label: "Hombre", value: Gender.MALE },
    { label: "Mujer", value: Gender.FEMALE },
    { label: "Otro", value: Gender.OTHER },
  ];

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
      className="content-card-white"
      aria-labelledby="register-legend"
      onSubmit={handleSubmit}
    >
      <legend className="register-legend">Edu-zas</legend>

      <div className="horizontal-group">
        <FieldWrapper
          alert={
            formState.state === "input_error" &&
            formState.tuition && (
              <Alert
                className="text-xs"
                type={AlertType.WARNING}
                message={formState.tuition}
              />
            )
          }
        >
          <FormInput<NewUser>
            name="tuition"
            placeholder="Matrícula"
            onChange={handleChange}
            hint="Primeras dos letras de tus apellidos, primer letra del nombre, periodo de inscripcion, año de inscripción, cédula"
          />
        </FieldWrapper>

        <FieldWrapper
          alert={
            formState.state === "input_error" &&
            formState.firstName && (
              <Alert
                className="text-xs"
                type={AlertType.WARNING}
                message={formState.firstName}
              />
            )
          }
        >
          <FormInput<NewUser>
            name="firstName"
            placeholder="Primer nombre"
            onChange={handleChange}
          />
        </FieldWrapper>

        <FieldWrapper
          alert={
            formState.state === "input_error" &&
            formState.midName && (
              <Alert
                className="text-xs"
                type={AlertType.WARNING}
                message={formState.midName}
              />
            )
          }
        >
          <FormInput<NewUser>
            name="midName"
            placeholder="Segundo nombre"
            onChange={handleChange}
          />
        </FieldWrapper>
      </div>

      <div className="horizontal-group">
        <FieldWrapper
          className="flex-1"
          alert={
            formState.state === "input_error" &&
            formState.fatherLastname && (
              <Alert
                className="text-xs"
                type={AlertType.WARNING}
                message={formState.fatherLastname}
              />
            )
          }
        >
          <FormInput<NewUser>
            name="fatherLastname"
            placeholder="Apellido paterno"
            onChange={handleChange}
          />
        </FieldWrapper>

        <FieldWrapper
          className="flex-1"
          alert={
            formState.state === "input_error" &&
            formState.motherLastname && (
              <Alert
                className="text-xs"
                type={AlertType.WARNING}
                message={formState.motherLastname}
              />
            )
          }
        >
          <FormInput<NewUser>
            name="motherLastname"
            placeholder="Apellido materno"
            onChange={handleChange}
          />
        </FieldWrapper>

        <FieldWrapper
          className="flex-1"
          alert={
            formState.state === "input_error" &&
            formState.gender && (
              <Alert
                className="text-xs"
                type={AlertType.WARNING}
                message={formState.gender}
              />
            )
          }
        >
          <FormSelect
            placeholder="Género"
            options={genderOptions}
            onChange={handleSelectGender}
          />
        </FieldWrapper>
      </div>

      <div className="horizontal-group">
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
          <FormInput<NewUser>
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
              <Alert
                className="text-xs"
                type={AlertType.WARNING}
                message={formState.password}
              />
            )
          }
        >
          <FormInput<NewUser>
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
                className="text-xs"
                type={AlertType.WARNING}
                message={formState.matchingPassword}
              />
            )
          }
        >
          <FormInput
            type="password"
            onChange={handleConfirmPasswordChange}
            placeholder="Confirmar contraseña"
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
