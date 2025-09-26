import React, { useState } from "react";
import { Hint } from "components";
import "../FormComponents.css";
import "./FormInput.css";

/**
 * Propiedades del componente FormInput.
 * @template T - Tipo del objeto formulario (por defecto string)
 */
type FormInputProps<T = string> = {
  /** Tipo de input HTML (text, password, email, etc) */
  type?: string;
  /** Texto placeholder que se muestra como etiqueta flotante */
  placeholder: string;
  /** Indica si el campo es obligatorio */
  required?: boolean;
  /** Nombre del campo (clave en el objeto T cuando T es un objeto) */
  name?: T extends string ? string : keyof T;
  /** Callback ejecutado cuando cambia el valor */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Clases CSS adicionales para el contenedor */
  className?: string;
  /** Texto de ayuda que se muestra junto al placeholder */
  hint?: string;
};

/**
 * Componente de input de formulario mejorado con soporte para campos de contraseña,
 * etiquetas flotantes y textos de ayuda.
 *
 * @template T - Tipo del objeto formulario (por defecto string)
 *
 * @example
 * // Ejemplo básico
 * <FormInput
 *   type="email"
 *   placeholder="Correo electrónico"
 *   name="email"
 *   required
 * />
 *
 * @example
 * // Ejemplo con contraseña y hint
 * <FormInput
 *   type="password"
 *   placeholder="Contraseña"
 *   hint="Mínimo 8 caracteres"
 *   required
 * />
 */
export function FormInput<T = string>({
  type = "text",
  placeholder,
  name,
  required = false,
  onChange,
  className = "",
  hint,
}: FormInputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const effectiveType = isPassword && showPassword ? "text" : type;

  const inputClass = `form-input-base ${isPassword ? "pr-10" : ""}`;

  return (
    <div className={`form-input-wrapper relative ${className}`}>
      <input
        type={effectiveType}
        name={name?.toString()}
        className={inputClass}
        onChange={onChange}
        required={required}
        placeholder=" "
        aria-label={placeholder}
      />

      <div className="form-field-placeholder">
        {placeholder}
        {hint && <Hint text={hint} className="ml-1" />}
      </div>

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((s) => !s)}
          aria-pressed={showPassword}
          aria-label={
            showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
          }
          title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {showPassword ? (
            // Ícono de ojo tachado (contraseña visible)
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M3 3L21 21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.58 10.58A3.5 3.5 0 0 0 13.42 13.42"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2.88 12.7A15.94 15.94 0 0 0 12 18c2.2 0 4.28-.42 6.12-1.16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            // Ícono de ojo (contraseña oculta)
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="12"
                r="3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
