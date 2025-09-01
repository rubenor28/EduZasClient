import React from "react";
import "./FormInput.css"; // reutiliza las clases del input: .form-field-placeholder, .form-hint-* etc.

export type Option = { value: string; label: string };

type FormSelectProps<T = string> = {
  name?: string | keyof T;
  placeholder?: string;
  hint?: string;
  className?: string;
  options: Option[];
  value?: string;
  defaultValue?: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  ariaLabel?: string;
};

export function FormSelect<T = string>({
  name,
  placeholder,
  hint,
  className = "",
  options,
  value,
  defaultValue,
  required = false,
  onChange,
  ariaLabel,
}: FormSelectProps<T>) {
  const hintId = hint ? `hint-${String(name ?? Math.random())}` : undefined;

  return (
    <div className={`form-input-wrapper ${className}`}>
      <div className="relative flex items-center">
        <select
          name={name?.toString()}
          className="form-input-base pr-8"
          value={value}
          defaultValue={defaultValue}
          required={required}
          onChange={onChange}
          aria-label={ariaLabel}
          aria-describedby={hintId}
        >
          {/* If you want a "blank" option, consumer can include it in options */}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {hint && (
          <div className="form-hint-icon" aria-hidden>
            ℹ️
            <span id={hintId} className="form-hint-tooltip" role="tooltip">
              {hint}
            </span>
          </div>
        )}
      </div>

      {placeholder && (
        <div className="form-field-placeholder">{placeholder}</div>
      )}
    </div>
  );
}
