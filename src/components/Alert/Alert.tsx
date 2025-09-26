import type { AlertType } from "./AlertType";

/**
 * Componente de alerta reutilizable para mostrar mensajes de estado al usuario.
 *
 * @remarks
 * El componente `Alert` renderiza un bloque visual con un color de fondo
 * distinto dependiendo del tipo de alerta (por ejemplo, `success`, `danger`,
 * `warning`, `info`).
 *
 * Los estilos están definidos en el archivo `Alert.css`, que proporciona la
 * apariencia visual para cada tipo de alerta.
 *
 * @example
 * Ejemplo de uso en un formulario:
 * ```tsx
 * import { Alert } from "./Alert";
 *
 * function LoginForm() {
 *   const [error, setError] = useState<string | null>(null);
 *
 *   return (
 *     <div>
 *       {error && <Alert type="danger" message={error} />}
 *     </div>
 *   );
 * }
 * ```
 *
 * @public
 */
export interface AlertProps {
  /**
   * Texto o mensaje que se mostrará dentro de la alerta.
   */
  message: string;

  /**
   * Tipo de alerta que define el estilo visual aplicado.
   * Debe ser uno de los valores permitidos en `AlertType`,
   * como: `"success"`, `"danger"`, `"warning"`, `"info"`.
   */
  type: AlertType;

  className?: string;
}

/**
 * Renderiza un bloque de alerta visual para comunicar mensajes importantes
 * al usuario.
 *
 * @param props - Propiedades de tipo {@link AlertProps}.
 * @returns Un elemento JSX que muestra la alerta estilizada.
 */
export function Alert({ type, message, className = "" }: AlertProps) {
  return (
    <div className={`alert-block alert-${type.toLowerCase()} ${className}`}>
      {message}
    </div>
  );
}
