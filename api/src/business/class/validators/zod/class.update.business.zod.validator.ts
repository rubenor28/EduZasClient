import {
  createZodBusinessValidator,
  uIntZodSchema,
} from "business/common/validators";
import z from "zod";

/**
 * Esquema de validación para actualizar una entidad `Class`.
 *
 * Define reglas estrictas para cada campo que puede actualizarse en una clase:
 * - `id`: obligatorio, debe ser una cadena de al menos 3 caracteres.
 * - `className`: obligatorio, cadena con mínimo 3 caracteres.
 * - `subject`: opcional, cadena con mínimo 3 caracteres.
 * - `section`: opcional, cadena con mínimo 3 caracteres.
 * - `ownerId`: obligatorio, número entero sin signo (validado por {@link uIntZodSchema}).
 *
 * Este esquema se construye con la librería [Zod](https://github.com/colinhacks/zod).
 *
 * @example
 * ```ts
 * // Ejemplo de datos válidos
 * const validData = {
 *   id: "abc123",
 *   className: "Matemáticas Avanzadas",
 *   subject: "Matemáticas",
 *   section: "A",
 *   ownerId: 42,
 * };
 *
 * schema.parse(validData); // ✅ Pasa validación
 *
 * // Ejemplo de datos inválidos
 * const invalidData = {
 *   id: "a", // muy corto
 *   className: "AB", // muy corto
 *   ownerId: -5, // no es un entero positivo
 * };
 *
 * schema.parse(invalidData); // ❌ Lanza un error de validación
 * ```
 */
const schema = z.object({
  id: z
    .string("El ID de la clase debe ser una cadena")
    .min(3, "El ID de la clase debe tener al menos 3 caracteres"),
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
  ownerId: uIntZodSchema,
});

/**
 * Validador de negocio para la actualización de clases.
 *
 * Envuelve el esquema Zod en un validador compatible con la interfaz de
 * validadores de negocio de la capa de dominio.
 *
 * Uso típico: validar `DTOs` de entrada antes de pasarlos a un `UseCase` o repositorio.
 *
 * @example
 * ```ts
 * const result = classUpdateBusinessZodValidator.validate({
 *   id: "class-123",
 *   className: "Historia",
 *   ownerId: 10,
 * });
 *
 * if (!result.success) {
 *   console.error(result.error);
 * } else {
 *   console.log("Datos válidos:", result.value);
 * }
 * ```
 */
export const classUpdateBusinessZodValidator =
  createZodBusinessValidator(schema);
