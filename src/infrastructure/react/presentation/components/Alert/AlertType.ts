/**
 * Conjunto de valores constantes que representan los distintos tipos de alertas
 * disponibles en la aplicación.
 *
 * @remarks
 * Este objeto se declara con `as const` para que sus valores sean literales
 * inmutables. Posteriormente, se utiliza en conjunto con la definición del tipo
 * {@link AlertType} para restringir las propiedades `type` de componentes como
 * {@link Alert}.
 *
 * @example
 * Uso al asignar un tipo de alerta en un componente:
 * ```tsx
 * import { Alert, AlertType } from "./Alert";
 *
 * function Demo() {
 *   return (
 *     <Alert type={AlertType.SUCCESS} message="Operación completada con éxito" />
 *   );
 * }
 * ```
 *
 * @public
 */
export const AlertType = {
  SUCCESS: "success",
  DANGER: "error",
  WARNING: "warning",
  INFO: "info",
} as const;

/**
 * Tipo derivado de los valores de {@link AlertType}.
 *
 * @remarks
 * Esto asegura que la variable de tipo solo pueda tomar uno de los valores
 * definidos en `AlertType`, evitando strings arbitrarios.
 *
 * Por ejemplo, `"success" | "error" | "warning" | "info"`.
 *
 * @example
 * ```ts
 * function showAlert(type: AlertType) {
 *   console.log("Mostrando alerta de tipo:", type);
 * }
 *
 * showAlert("success"); // ✅ válido
 * showAlert("danger");  // ❌ error de compilación
 * ```
 */
export type AlertType = (typeof AlertType)[keyof typeof AlertType];
