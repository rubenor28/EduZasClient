import { Hint } from "components";
import "../FormComponents.css";
import "./FormInput.css"

/**
 * PROPIEDADES DEL COMPONENTE FormInput
 *
 * @template T - Tipo genérico para el nombre del campo (útil para formularios tipados)
 * @property {string} type - Tipo de input (text, email, password, etc.)
 * @property {string} placeholder - Texto que se muestra como etiqueta flotante
 * @property {boolean} required - Si el campo es obligatorio
 * @property {string | keyof T} name - Nombre del campo para formularios
 * @property {function} onChange - Manejador de eventos para cambios en el input
 * @property {string} className - Clases CSS adicionales para personalización
 * @property {string} hint - Texto de ayuda que muestra un tooltip al usuario
 */
type FormInputProps<T = string> = {
  type?: string;
  placeholder: string;
  required?: boolean;
  name?: string | keyof T;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  hint?: string;
};

/**
 * COMPONENTE FormInput
 *
 * Input de formulario con etiqueta flotante y sistema de ayuda opcional.
 * Diseñado para integrarse con formularios React con soporte para tipos genéricos.
 *
 * Características principales:
 * - Placeholder que se convierte en etiqueta flotante
 * - Soporte para tooltips de ayuda (Hint)
 * - Estilizado con clases CSS personalizadas
 * - Compatible con formularios controlados y no controlados
 *
 * @param {FormInputProps} props - Propiedades del componente
 * @returns {JSX.Element} Componente de input de formulario estilizado
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
  return (
    <div className={`form-input-wrapper ${className}`}>
      {/* Input principal con placeholder espacial para la animación */}
      <input
        type={type}
        name={name?.toString()}
        className="form-input-base pr-8"
        onChange={onChange}
        required={required}
        placeholder=" " // Espacio necesario para la animación CSS
      />

      {/* Contenedor de la etiqueta flotante y hint de ayuda */}
      <div className="form-field-placeholder">
        {placeholder}
        {/* Componente Hint que muestra tooltip de ayuda */}
        {hint && <Hint text={hint} className="ml-1" />}
      </div>
    </div>
  );
}
