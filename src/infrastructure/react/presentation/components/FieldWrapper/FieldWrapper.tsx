/**
 * Props para el componente {@link FieldWrapper}.
 *
 * @property children - Nodo React que representa el campo de formulario
 *   (por ejemplo, un `<input>`, `<select>`, etc.).
 * @property alert - Nodo React opcional que se mostrará encima del campo.
 *   Usualmente se utiliza para desplegar mensajes de error o advertencias
 *   mediante el componente {@link Alert}.
 */
type FieldWrapperProps = {
  children: React.ReactNode;
  alert?: React.ReactNode;
  className?: string;
};

/**
 * Componente contenedor que agrupa un campo de formulario con un área reservada
 * para mostrar un mensaje de alerta.
 *
 * @remarks
 * El área de alerta siempre ocupa espacio fijo (mínimo `1.25rem`), lo que evita
 * que el formulario "salte" cuando aparecen o desaparecen mensajes de error.
 *
 * Esto ayuda a mantener un layout consistente en formularios con validaciones.
 *
 * @example
 * Uso en un formulario con validación:
 * ```tsx
 * <FieldWrapper
 *   alert={
 *     hasError && (
 *       <Alert type={AlertType.WARNING} message="Campo obligatorio" />
 *     )
 *   }
 * >
 *   <input
 *     type="text"
 *     name="lastname"
 *     placeholder="Apellido materno"
 *     onChange={handleChange}
 *   />
 * </FieldWrapper>
 * ```
 *
 * @public
 */
export function FieldWrapper({
  alert,
  children,
  className = "",
}: FieldWrapperProps) {
  return (
    <div className={`mb-4 ${className}`}>
      <div className="min-h-[2.2rem] mb-1">{alert}</div>
      <div>{children}</div>
    </div>
  );
}
