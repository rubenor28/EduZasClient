import {
  alertIfInputError,
  fieldErrorsToErrorDictionary,
  type ClassDomain,
  type FormState,
} from "@domain";
import type { ClassUpdateDTO } from "@application";
import { classService } from "@dependencies";
import { FieldWrapper, FormInput, ColorPicker } from "@components";
import { useClassPopUpFormContext, useClassViewContext } from "@context";
import { useState } from "react";

export function ClassForm() {
  const [formState, setFormState] = useState<FormState<ClassUpdateDTO>>({
    state: "idle",
  });

  const { refreshClasses } = useClassViewContext();
  const { setOpen, input, setInput } = useClassPopUpFormContext();
  const { mode, data } = input;

  const legend = {
    ["create"]: "Crear clase",
    ["modify"]: "Actualizar clase",
  };

  const buttonText = {
    ["create"]: "Crear",
    ["modify"]: "Actualizar",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (input.mode === "create") {
      setInput({
        mode: "create",
        data: { ...input.data, [name]: value.trim() },
      });
    } else {
      setInput({
        mode: "modify",
        data: { ...input.data, [name]: value.trim() },
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState({ state: "loading" });

    const serviceCall =
      mode === "create"
        ? classService.createClass({
            ...data,
            section: data.section === "" ? undefined : data.section,
            subject: data.subject === "" ? undefined : data.subject,
          })
        : classService.updateClass({
            ...data,
            section: data.section === "" ? undefined : data.section,
            subject: data.subject === "" ? undefined : data.subject,
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

        setFormState({ state: "success" });
        refreshClasses();
        setOpen(false);

        setInput({
          mode: "create",
          data: { className: "", color: "#000000", subject: "", section: "" },
        });

        setInput({
          mode: "create",
          data: { className: "", color: "#000000", subject: "", section: "" },
        });
      })
      .catch(() => setFormState({ state: "unexpected_error" }));
  };

  return (
    <form onSubmit={handleSubmit} className="class-form-layout">
      <legend className="form-legend">{legend[mode]}</legend>

      <FieldWrapper alert={alertIfInputError(formState, "className")}>
        <FormInput<ClassDomain>
          name="className"
          placeholder="Nombre de la clase"
          value={data.className}
          onChange={handleChange}
        />
      </FieldWrapper>

      <FieldWrapper alert={alertIfInputError(formState, "subject")}>
        <FormInput<ClassUpdateDTO>
          name="subject"
          placeholder="Materia"
          value={data.subject || ""}
          onChange={handleChange}
        />
      </FieldWrapper>

      <FieldWrapper alert={alertIfInputError(formState, "section")}>
        <FormInput<ClassUpdateDTO>
          name="section"
          placeholder="Sección"
          value={data.section || ""}
          onChange={handleChange}
        />
      </FieldWrapper>

      <FieldWrapper alert={alertIfInputError(formState, "color")}>
        <ColorPicker
          name="color"
          label="Color de la clase"
          value={data.color || "#000000"}
          onChange={handleChange}
        />
      </FieldWrapper>

      <div className="flex justify-end">
        <button className="submit-button" type="submit">
          {buttonText[mode]}
        </button>
      </div>
    </form>
  );
}
