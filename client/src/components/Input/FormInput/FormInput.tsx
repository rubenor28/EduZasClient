import { Hint } from "../Hint/Hint";
import "./FormInput.css";

type FormInputProps<T = string> = {
  type?: string;
  placeholder: string;
  required?: boolean;
  name?: string | keyof T;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  hint?: string;
};

export function FormInput<T = string>({
  type = "text",
  placeholder,
  name,
  required = false,
  onChange,
  className = "",
  hint,
}: FormInputProps<T>) {
  return (
    <div className={`form-input-wrapper ${className}`}>
      <input
        type={type}
        name={name?.toString()}
        className="form-input-base pr-8"
        onChange={onChange}
        required={required}
        placeholder=" "
      />

      <div className="form-field-placeholder">
        {placeholder}
        {hint && <Hint text={hint} className="ml-1" />}
      </div>
    </div>
  );
}
