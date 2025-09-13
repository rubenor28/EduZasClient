import {
  createZodObjectTypeValidator,
  uIntZodSchema,
} from "business/common/validators";
import z from "zod";

/**
 * Esquema de validación para actualizar una entidad `Class` a nivel de tipo.
 *
 * Este esquema define las reglas básicas de tipo sin restricciones adicionales
 * (como longitud mínima). Sirve para garantizar que los datos de actualización
 * respeten la forma general de una clase:
 *
 * - `id`: obligatorio, tipo cadena.
 * - `className`: obligatorio, tipo cadena.
 * - `subject`: opcional, tipo cadena.
 * - `section`: opcional, tipo cadena.
 * - `ownerId`: obligatorio, número entero sin signo (validado por {@link uIntZodSchema}).
 *
 * @example
 * ```ts
 * const valid = {
 *   id: "abc123",
 *   className: "Matemáticas",
 *   ownerId: 7,
 * };
 *
 * schema.parse(valid); // ✅ válido
 *
 * const invalid = {
 *   id: 123, // ❌ no es string
 *   className: null, // ❌ no es string
 *   ownerId: -5, // ❌ no es entero sin signo
 * };
 *
 * schema.parse(invalid); // Lanza error de validación
 * ```
 */
const schema = z.object({
  id: z.string("El ID de la clase debe ser una cadena"),
  className: z.string("El nombre de la clase debe ser una cadena"),
  subject: z.string("El nombre de la materia debe ser una cadena").optional(),
  section: z.string("El nombre de la sección debe ser una cadena").optional(),
  ownerId: uIntZodSchema,
});

/**
 * Validador de tipo para actualizaciones de `Class`.
 *
 * Envuelve el esquema Zod en un validador de objetos genérico, usando
 * {@link createZodObjectTypeValidator}.  
 *
 * Útil para verificar la estructura de datos sin aplicar reglas de negocio
 * adicionales (solo garantiza tipos correctos).
 *
 * @example
 * ```ts
 * const result = classUpdateTypeZodValidator.validate({
 *   id: "class-1",
 *   className: "Historia",
 *   ownerId: 5,
 * });
 *
 * if (!result.success) {
 *   console.error("Error:", result.error);
 * } else {
 *   console.log("Datos válidos:", result.value);
 * }
 * ```
 */
export const classUpdateTypeZodValidator = createZodObjectTypeValidator(schema);
