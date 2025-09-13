import z from "zod";
import { createZodBusinessValidator } from "business/common/validators";

/**
 * Esquema de validación para crear una nueva clase pública (`PublicNewClass`).
 *
 * Define las reglas mínimas que deben cumplir los datos al registrar
 * una nueva clase desde la capa pública (por ejemplo, a través de una API HTTP).
 *
 * - `className`: obligatorio, cadena con al menos 3 caracteres.
 * - `subject`: opcional, cadena con al menos 3 caracteres.
 * - `section`: opcional, cadena con al menos 3 caracteres.
 *
 * Se implementa usando la librería [Zod](https://github.com/colinhacks/zod).
 *
 * @example
 * ```ts
 * // ✅ Datos válidos
 * const valid = {
 *   className: "Matemáticas",
 *   subject: "Álgebra",
 *   section: "A",
 * };
 * schema.parse(valid); // Pasa la validación
 *
 * // ❌ Datos inválidos
 * const invalid = {
 *   className: "AB", // muy corto
 *   subject: 123,    // no es string
 * };
 * schema.parse(invalid); // Lanza error de validación
 * ```
 */
const schema = z.object({
  className: z
    .string("El nombre de la clase debe ser una cadena")
    .min(3, "El nombre de la clase debe tener al menos 3 caracteres"),
  subject: z
    .string("El nombre de la materia debe ser una cadena")
    .min(3, "El nombre de la materia debe tener al menos 3 caracteres")
    .optional(),
  section: z
    .string("El nombre de la sección debe ser una cadena")
    .min(3, "El nombre de la sección debe tener al menos 3 caracteres")
    .optional(),
});

/**
 * Validador de negocio para la creación de nuevas clases públicas.
 *
 * Envuelve el esquema Zod en un validador compatible con la capa de negocio,
 * permitiendo validar datos de entrada antes de usarlos en un caso de uso
 * o guardarlos en la base de datos.
 *
 * @example
 * ```ts
 * const result = publicNewClassBusinessValidator.validate({
 *   className: "Historia",
 *   section: "B",
 * });
 *
 * if (!result.success) {
 *   console.error("Error:", result.error);
 * } else {
 *   console.log("Datos válidos:", result.value);
 * }
 * ```
 */
export const publicNewClassBusinessValidator =
  createZodBusinessValidator(schema);
