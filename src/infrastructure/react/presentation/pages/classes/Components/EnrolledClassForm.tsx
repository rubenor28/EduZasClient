import { Alert, FieldWrapper, FormInput } from "@components";
import { usePopUpFormContext } from "@context";
import { useState } from "react";

const FormState = {
  Idle: "idle",
  InputError: "input_error",
  UnexpectedError: "unexpected_error",
  Loading: "loading",
  Success: "success"
} as const;

type FormState = typeof FormState[keyof typeof FormState];

export function EnrolledClassesForm() {
  const { setPopUpOpen } = usePopUpFormContext();
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [formState, setFormState] = useState<FormState>(FormState.Idle);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setInput(e.target.value.trim());
  };

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPopUpOpen(false);
  };

  return (
    <form>
      <legend className="form-legend">Inscribirse a una clase</legend>
      <FieldWrapper alert={error && <Alert message={error} type="warning" />} className="mb-15">
        <FormInput placeholder="Código de invitación de la clase" onChange={handleChange} />
      </FieldWrapper>
      <button className="mb-0 submit-button text-lg" type="submit" onClick={handleSubmit}>Inscribirse</button>
    </form>
  );
}
