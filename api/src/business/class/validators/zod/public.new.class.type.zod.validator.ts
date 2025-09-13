import {
  createZodObjectTypeValidator,
  uIntZodSchema,
} from "business/common/validators";
import z from "zod";

/**
 * Esquema de validación de tipos para `PublicNewClass`.
 *
 * Garantiza que los datos de creación de una nueva clase pública
 * cumplan con la forma general esperada, pero **sin aplicar reglas
 * de negocio adicionales** como mínimos de longitud.  
 *
 * Campos validados:
 * - `className`: obligatorio, tipo cadena.
 * - `subject`: opcional, tipo cadena.
 * - `section`: opcional, tipo cadena.
 * - `ownerId`: obligatorio, número entero sin signo (usando {@link uIntZodSchema}).
 *
 * @example
 * ```ts
 * const valid = {
 *   className: "Matemáticas",
 *   subject: "Álgebra",
 *   ownerId: 12,
 * };
 * schema.parse(valid); // ✅ válido
 *
 * const invalid = {
 *   className: 42,     // ❌ no es string
 *   ownerId: -3,       // ❌ no es entero positivo
 * };
 * schema.parse(invalid); // Lanza error de validación
 * ```
 */
const schema = z.object({
  className: z.string("El nombre de la clase debe ser una cadena"),
  subject: z.string("El nombre de la materia debe ser una cadena").optional(),
  section: z.string("El nombre de la sección debe ser una cadena").optional(),
  ownerId: uIntZodSchema,
});

/**
 * Validador de tipos para `PublicNewClass`.
 *
 * Usa {@link createZodObjectTypeValidator} para envolver el esquema Zod
 * en un validador genérico de objetos.  
 * Se enfoca en la **estructura y tipos** de los datos, a diferencia de un
 * validador de negocio que incluiría también reglas de dominio.
 *
 * @example
 * ```ts
 * const result = publicNewClassTypeValidator.validate({
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
export const publicNewClassTypeValidator =
  createZodObjectTypeValidator(schema);
