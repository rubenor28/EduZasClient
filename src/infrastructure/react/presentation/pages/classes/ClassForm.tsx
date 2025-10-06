import {
  type ClassDomain,
  alertIfInputError,
  fieldErrorsToErrorDictionary,
  type FormState,
} from "@domain";
import type { NewClassDTO } from "@application";
import { classService } from "@dependencies";
import { FieldWrapper, FormInput, ColorPicker } from "@components";
import { useEffect, useState } from "react";

type ClassFormState = FormState<NewClassDTO>;
export type ClassFormMode =
  | { type: "create" }
  | { type: "update"; data: ClassDomain };

export type ClassFormProps = {
  mode: ClassFormMode;
  onSubmit?: () => void;
};

export function ClassForm({ mode, onSubmit = () => {} }: ClassFormProps) {
  const [formState, setFormState] = useState<ClassFormState>({ state: "idle" });
  const [input, setInput] = useState<NewClassDTO>({
    className: "",
    subject: "",
    section: "",
    color: "#007bff",
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

    const { className, color, subject, section } = mode.data;
    setInput({
      className,
      color,
      subject: (subject as any)?.value || "",
      section: (section as any)?.value || "",
    });
  }, [mode]);

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
        ? classService.createClass({
            ...input,
            section: input.section === "" ? undefined : input.section,
            subject: input.subject === "" ? undefined : input.subject,
          })
        : classService.updateClass({
            id: mode.data.id,
            active: mode.data.active,
            className: input.className,
            color: input.color,
            section: input.section === "" ? undefined : input.section,
            subject: input.subject === "" ? undefined : input.subject,
          });

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

          return;
        }

        onSubmit();
      })
      .catch(() => setFormState({ state: "unexpected_error" }));
  };

  return (
    <form onSubmit={handleSubmit} className="class-form-layout">
      <legend className="form-legend">{legend[mode.type]}</legend>

      <FieldWrapper alert={alertIfInputError(formState, "className")}>
        <FormInput<NewClassDTO>
          name="className"
          placeholder="Nombre de la clase"
          value={input.className}
          onChange={handleChange}
        />
      </FieldWrapper>

      <FieldWrapper alert={alertIfInputError(formState, "subject")}>
        <FormInput<NewClassDTO>
          name="subject"
          placeholder="Materia"
          value={input.subject}
          onChange={handleChange}
        />
      </FieldWrapper>

      <FieldWrapper alert={alertIfInputError(formState, "section")}>
        <FormInput<NewClassDTO>
          name="section"
          placeholder="Sección"
          value={input.section}
          onChange={handleChange}
        />
      </FieldWrapper>

      <FieldWrapper alert={alertIfInputError(formState, "color")}>
        <ColorPicker
          name="color"
          label="Color de la clase"
          value={input.color || "#FFFFFF"}
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
