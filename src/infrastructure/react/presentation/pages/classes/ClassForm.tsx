import {
  type ClassDomain,
  alertIfInputError,
  fieldErrorsToErrorDictionary,
  type FormState,
} from "@domain";
import type { NewClassDTO } from "@application";
import { classService } from "@dependencies";
import { FieldWrapper, FormInput } from "@components";
import { useEffect, useState } from "react";

type ClassFormState = FormState<NewClassDTO>;
export type ClassFormMode =
  | { type: "create" }
  | { type: "update"; data: ClassDomain };

export type ClassFormProps = {
  mode: ClassFormMode;
};

export function ClassForm({ mode }: ClassFormProps) {
  const [formState, setFormState] = useState<ClassFormState>({ state: "idle" });
  const [input, setInput] = useState<NewClassDTO>({
    className: "",
    subject: "",
    section: "",
  });

  const legend = {
    ["create"]: "Crear clase",
    ["update"]: "Actualizar clase",
  };

  const buttonText = {
    ["create"]: "Crear",
    ["update"]: "Actualizar",
  };

  useEffect(() => {
    if (mode.type !== "update") return;
    setInput({ ...mode.data });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState({ state: "loading" });

    const serviceCall =
      mode.type === "create"
        ? classService.createClass(input)
        : classService.createClass(input);

    serviceCall
      .then((result) => {
        if (result.err) {
          const err = result.val;

          if (err.type === "authError")
            return setFormState({ state: "unexpected_error" });

          setFormState({
            state: "input_error",
            ...fieldErrorsToErrorDictionary(err.error),
          });
        }
      })
      .catch(() => setFormState({ state: "unexpected_error" }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <legend className="form-legend">{legend[mode.type]}</legend>

      <FieldWrapper alert={alertIfInputError(formState, "className")}>
        <FormInput<NewClassDTO>
          name="className"
          placeholder="Nombre de la clase"
          onChange={handleChange}
        />
      </FieldWrapper>

      <FieldWrapper alert={alertIfInputError(formState, "subject")}>
        <FormInput<NewClassDTO>
          name="subject"
          placeholder="Materia"
          onChange={handleChange}
        />
      </FieldWrapper>

      <FieldWrapper alert={alertIfInputError(formState, "section")}>
        <FormInput<NewClassDTO>
          name="section"
          placeholder="Sección"
          onChange={handleChange}
        />
      </FieldWrapper>

      <div className="flex justify-end">
        <button className="submit-button" type="submit">
          {buttonText[mode.type]}
        </button>
      </div>
    </form>
  );
}
