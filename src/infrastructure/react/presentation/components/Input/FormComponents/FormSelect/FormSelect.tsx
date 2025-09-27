import React from "react";
import { Hint } from "@components";
import "../FormComponents.css";
import "./FormSelect.css";

/**
 * Representa una opción dentro de un `<select>`.
 */
export type FormSelectOpt = {
  /** Valor interno que será enviado en el formulario. */
  value: string;
  /** Texto visible al usuario en la lista de opciones. */
  label: string;
};

/**
 * Lista de opciones para el componente {@link FormSelect}.
 */
export type FormSelectOpts = Array<FormSelectOpt>;

type FormSelectProps<T = string> = {
  /**
   * Opciones que el usuario podrá seleccionar.
   */
  options: FormSelectOpts;

  /**
   * Texto que describe el propósito del campo.
   * Se muestra como etiqueta flotante (placeholder).
   */
  placeholder: string;

  /**
   * Indica si el campo es obligatorio en el formulario.
   *
   * @default false
   */
  required?: boolean;

  /**
   * Nombre del campo en el formulario.
   * Puede ser una cadena o una clave de un objeto genérico `T`.
   */
  name?: string | keyof T;

  /**
   * Callback que se ejecuta cada vez que cambia el valor seleccionado.
   */
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;

  /**
   * Clases CSS adicionales para personalizar el estilo.
   *
   * @default ""
   */
  className?: string;

  /**
   * Texto de ayuda opcional que se muestra junto al placeholder.
   */
  hint?: string;

  /**
   * Valor actual seleccionado en el `<select>`.
   */
  value?: string;
};

/**
 * Componente de formulario para seleccionar un valor de una lista desplegable.
 *
 * Renderiza un `<select>` estilizado con soporte para placeholder, validación requerida
 * y un texto de ayuda opcional.
 *
 * @param props - Propiedades del componente.
 *
 * @example
 * ```tsx
 * const options = [
 *   { value: "math", label: "Matemáticas" },
 *   { value: "physics", label: "Física" },
 *   { value: "chemistry", label: "Química" },
 * ];
 *
 * <FormSelect
 *   options={options}
 *   placeholder="Selecciona una materia"
 *   required
 *   onChange={(e) => console.log(e.target.value)}
 *   hint="Campo obligatorio"
 * />
 * ```
 */
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
