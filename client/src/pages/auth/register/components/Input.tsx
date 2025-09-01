import type { NewUser } from "entities/users/entities";
import "../Register.css";

/**
 * Props para el componente {@link RegisterInput}.
 *
 * @property type - Tipo de input HTML (`text`, `password`, `email`, etc.).
 *   Por defecto es `"text"`.
 * @property placeholder - Texto que se muestra cuando el input está vacío.
 * @property required - Indica si el campo es obligatorio. Por defecto `false`.
 * @property name - Clave de `NewUser` que identifica el campo.
 * @property onChange - Callback que se ejecuta al cambiar el valor del input.
 */
type RegisterInputProps = {
  type?: string;
  placeholder: string;
  required?: true;
  name: keyof NewUser;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

/**
 * Input estilizado para formularios de registro de usuario.
 *
 * @remarks
 * Este componente encapsula un `<input>` HTML estándar, aplicando estilos
 * predefinidos mediante la clase `input-base` y validación de campos de
 * `NewUser`. Facilita la consistencia visual y el tipado seguro.
 *
 * @example
 * Uso en un formulario de registro:
 * ```tsx
 * <RegisterInput
 *   name="firstName"
 *   placeholder="Nombre"
 *   required
 *   onChange={handleChange}
 * />
 * ```
 *
 * @public
 */
export function RegisterInput({
  type,
  placeholder,
  name,
  required,
  onChange,
}: RegisterInputProps) {
  return (
    <div className="relative">
      <input
        type={type ?? "text"}
        name={name}
        className="input-base"
        onChange={onChange}
        required={required ?? false}
      />
      <div className="field-placeholder">{placeholder}</div>
    </div>
  );
}
