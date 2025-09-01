import { FieldWrapper } from "components";
import { FormInput } from "components/Input";
import { Hint } from "components/Input";
import "./Dashboard.css";

export function Form() {
  return (
    <>
      <form action="">
        <legend>Hola</legend>
      </form>
      <div className="field-group">
        <FieldWrapper>
          <FormInput placeholder="Hola" hint="Un string" />
        </FieldWrapper>
        <FieldWrapper>
          <Hint text="Hello world"/>
        </FieldWrapper>
      </div>
    </>
  );
}
