import { useState } from "react";
import type { NewUserDTO } from "@application";
import { authService } from "@dependencies";
import { FieldWrapper, Alert, AlertType, FormInput } from "@components";

type InputError = Partial<Record<keyof NewUserDTO, string>> & {
  matchingPassword?: string;
};

type FormState =
  | { state: "idle" | "loading" | "success" | "unexpected_error" }
  | ({ state: "input_error" } & InputError);

// Register.tsx
export function RegisterForm() {
  const [newUser, setNewUser] = useState<NewUserDTO>({
    email: "",
    fatherLastName: "",
    firstName: "",
    password: "",
  });

  const [formState, setFormState] = useState<FormState>({ state: "idle" });

  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const hints = {
    tuition:
      "3 letras en mayúscula (incluye Ñ/acentos) " +
      "+ periodo (O, I, P o V) + últimos dos " +
      "digitos del año de inscripción + cédula",
    firstName: "Solo letras (incluye acentos y Ñ), mínimo 3 caracteres",
    midName:
      "Mínimo 3 letras o compuesto con" +
      " artículos/preposiciones (de, del," +
      " la, las, los, el, al) seguido de" +
      " palabra de 3+ letras",
    fatherLastname: "Solo letras (incluye acentos y Ñ), mínimo 3 caracteres",
    motherLastname:
      "Mínimo 3 letras o compuesto con" +
      " artículos/preposiciones (de, del," +
      " la, las, los, el, al) seguido de" +
      " palabra de 3+ letras",
    password:
      "Mínimo 8 caracteres, con al" +
      " menos 1 mayúscula, 1 minúscula y 1 carácter especial",
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const {
      email,
      firstName,
      midName,
      motherLastName,
      fatherLastName,
      password,
    } = newUser;

    // validación local de coincidencia de contraseñas
    if ((password ?? "") !== confirmPassword) {
      setFormState({
        state: "input_error",
        matchingPassword: "Contraseñas no coinciden",
      });
      return;
    }

    setFormState({ state: "loading" });

    authService
      .signIn({
        email: email.trim(),
        firstName: firstName.trim(),
        midName: !midName || midName === "" ? undefined : midName.trim(),
        fatherLastName: fatherLastName.trim(),
        motherLastName:
          !motherLastName || motherLastName === ""
            ? undefined
            : motherLastName.trim(),
        password,
      })
      .then((result) => {
        console.log(typeof result.val);
        if (result.err) {
          const inputErrs: InputError = result.val.reduce(
            (acc, curr) => ({ ...acc, [curr.field]: curr.message }),
            {},
          );

          console.log("A");
          console.log(result.val);

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

  return (
    <form
      className="content-card-white"
      aria-labelledby="register-legend"
      onSubmit={handleSubmit}
    >
      <a href="/">
        <legend className="register-legend">Edu-zas</legend>
      </a>

      <div className="horizontal-group">
        <FieldWrapper
          alert={
            formState.state === "input_error" &&
            formState.firstName && (
              <Alert
                type={AlertType.WARNING}
                message={formState.firstName}
              />
            )
          }
        >
          <FormInput<NewUserDTO>
            name="firstName"
            placeholder="Primer nombre"
            onChange={handleChange}
            hint={hints.firstName}
          />
        </FieldWrapper>

        <FieldWrapper
          alert={
            formState.state === "input_error" &&
            formState.midName && (
              <Alert
                type={AlertType.WARNING}
                message={formState.midName}
              />
            )
          }
        >
          <FormInput<NewUserDTO>
            name="midName"
            placeholder="Segundo nombre"
            onChange={handleChange}
            hint={hints.midName}
          />
        </FieldWrapper>
      </div>

      <div className="horizontal-group">
        <FieldWrapper
          className="flex-1"
          alert={
            formState.state === "input_error" &&
            formState.fatherLastName && (
              <Alert
                className="text-sm"
                type={AlertType.WARNING}
                message={formState.fatherLastName}
              />
            )
          }
        >
          <FormInput<NewUserDTO>
            name="fatherLastName"
            placeholder="Apellido paterno"
            onChange={handleChange}
            hint={hints.fatherLastname}
          />
        </FieldWrapper>

        <FieldWrapper
          className="flex-1"
          alert={
            formState.state === "input_error" &&
            formState.motherLastName && (
              <Alert
                className="text-sm"
                type={AlertType.WARNING}
                message={formState.motherLastName}
              />
            )
          }
        >
          <FormInput<NewUserDTO>
            name="motherLastName"
            placeholder="Apellido materno"
            onChange={handleChange}
            hint={hints.motherLastname}
          />
        </FieldWrapper>
      </div>

      <div className="horizontal-group">
        <FieldWrapper
          alert={
            formState.state === "input_error" &&
            formState.email && (
              <Alert
                className="text-sm"
                type={AlertType.WARNING}
                message={formState.email}
              />
            )
          }
        >
          <FormInput<NewUserDTO>
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
                className="text-sm"
                type={AlertType.WARNING}
                message={formState.password}
              />
            )
          }
        >
          <FormInput<NewUserDTO>
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={handleChange}
            hint={hints.password}
          />
        </FieldWrapper>

        <FieldWrapper
          alert={
            formState.state === "input_error" &&
            formState.matchingPassword && (
              <Alert
                className="text-sm"
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

      <div className="min-h-[2.2rem] mb-1">
        {formState.state === "success" && (
          <Alert
            className="text-xl text-center"
            type="success"
            message="Se registró correctamente"
          />
        )}

        {formState.state === "loading" && (
          <Alert className="text-xl text-center" type="info" message="Procesando..." />
        )}

        {formState.state === "unexpected_error" && (
          <Alert
            className="text-xl text-center"
            type="danger"
            message="Ocurrió un error, intente más tarde"
          />
        )}
      </div>

      <a
        href="/login"
        className="text-blue-600 hover:text-blue-600 visited:text-blue-600 active:text-blue-600"
      >
        ¿Ya tienes una cuenta? Inicia sesión
      </a>

      <div className="flex justify-end">
        <button type="submit" className="submit-button">
          Registrar
        </button>
      </div>
    </form>
  );
}
