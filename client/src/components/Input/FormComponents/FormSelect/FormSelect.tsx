import React from "react";
import { Hint } from "components";
import "../FormComponents.css";
import "./FormSelect.css";

export type FormSelectOpts = Array<{ value: string; label: string }>;

type FormSelectProps<T = string> = {
  options: FormSelectOpts;
  placeholder: string;
  required?: boolean;
  name?: string | keyof T;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  hint?: string;
  value?: string;
};

export function FormSelect<T = string>({
  options,
  placeholder,
  name,
  required = false,
  onChange,
  className = "",
  hint,
  value,
}: FormSelectProps<T>) {
  return (
    <div className={`form-select-wrapper ${className}`}>
      <select
        name={name?.toString()}
        className="form-input-base pr-8"
        onChange={onChange}
        required={required}
        value={value}
        defaultValue=""
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <div className="form-field-placeholder">
        {placeholder}
        {hint && <Hint text={hint} className="ml-1" />}
      </div>
    </div>
  );
}
