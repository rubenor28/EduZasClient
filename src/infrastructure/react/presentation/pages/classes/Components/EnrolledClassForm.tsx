import { Alert, FormInput } from "@components";
import { useClassViewContext, usePopUpFormContext } from "@context";
import { useState } from "react";
import { classService } from "@dependencies";

type FormState =
  | {
      state: "idle" | "unexpected_error" | "loading" | "success";
    }
  | { state: "input_error"; error: string };

export function EnrolledClassesForm() {
  const { setPopUpOpen } = usePopUpFormContext();
  const { refreshClasses } = useClassViewContext();
  const [input, setInput] = useState("");
  const [formState, setFormState] = useState<FormState>({ state: "idle" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setInput(e.target.value.trim());
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    classService
      .enrollClass(input)
      .then((result) => {
        console.log(`Error? ${result.err}`);

        if (result.err) {
          const { type, error } = result.val;

          console.log(`Tipo de error ${type}`);

          if (type === "authError") {
            setFormState({ state: "unexpected_error" });
            return;
          }

          error.forEach((err) => {
            if (err.field === "classId")
              setFormState({ state: "input_error", error: err.message });
          });

          return;
        }

        refreshClasses();
        setPopUpOpen(false);
      })
      .catch(() => setFormState({ state: "unexpected_error" }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <legend className="form-legend">Inscribirse a una clase</legend>

      {formState.state === "input_error" && (
        <Alert message={formState.error} type="warning" className="mb-10" />
      )}

      {formState.state === "unexpected_error" && (
        <Alert
          message="Ocurrió un error, intente más tarde"
          type="danger"
          className="mb-10"
        />
      )}

      <FormInput
        placeholder="Código de invitación de la clase"
        onChange={handleChange}
      />

      <button className="mt-10 submit-button text-lg" type="submit">
        Inscribirse
      </button>
    </form>
  );
}
