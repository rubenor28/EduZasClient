import z from "zod";
import { createZodObjectTypeValidator } from "business/common/validators/zod/zod.validator";
import { UserType } from "persistence/users/enums";

/**
 * Esquema de validación de tipos para `PublicUser`.
 *
 * Define la forma básica de un usuario público sin aplicar reglas
 * de negocio adicionales, garantizando que los datos recibidos o expuestos
 * cumplan con la estructura correcta:
 *
 * - `id`: obligatorio, número entero positivo (coaccionado desde string si es necesario).
 * - `tuition`: obligatorio, cadena (matrícula o número de control).
 * - `firstName`: obligatorio, cadena (nombre del usuario).
 * - `midName`: opcional, cadena (segundo nombre).
 * - `fatherLastname`: obligatorio, cadena (apellido paterno).
 * - `motherLastname`: opcional, cadena (apellido materno).
 * - `email`: obligatorio, cadena (correo electrónico).
 *
 * Se implementa con [Zod](https://github.com/colinhacks/zod), usando coerción
 * en `id` para aceptar entradas como `"42"` y convertirlas en `42`.
 *
 * @example
 * ```ts
 * // ✅ Válido
 * const valid = {
 *   id: "101",              // coaccionado a número
 *   tuition: "A12345",
 *   firstName: "Carlos",
 *   fatherLastname: "Ramírez",
 *   email: "carlos@example.com",
 * };
 * schema.parse(valid); // pasa validación
 *
 * // ❌ Inválido
 * const invalid = {
 *   id: -5,                // no es positivo
 *   tuition: 123,          // no es string
 *   firstName: null,       // no es string
 *   email: "no-es-email",  // no validado como email (solo string aquí)
 * };
 * schema.parse(invalid); // lanza error de validación
 * ```
 */
const schema = z.object({
  id: z.coerce.number().int().positive(),
  tuition: z.string(),
  firstName: z.string(),
  midName: z.string().optional(),
  fatherLastname: z.string(),
  motherLastname: z.string().optional(),
  email: z.string(),
  role: z.enum(UserType),
});

/**
 * Validador de tipos para `PublicUser`.
 *
 * Usa {@link createZodObjectTypeValidator} para envolver el esquema Zod
 * en un validador genérico de objetos, asegurando únicamente la
 * **estructura y tipos de datos**.
 *
 * @example
 * ```ts
 * const result = publicUserTypeZodValidator.validate({
 *   id: "50", // coaccionado a number
 *   tuition: "B98765",
 *   firstName: "Ana",
 *   fatherLastname: "López",
 *   email: "ana@example.com",
 * });
 *
 * if (!result.success) {
 *   console.error("Error:", result.error);
 * } else {
 *   console.log("Usuario válido:", result.value);
 * }
 * ```
 */
export const publicUserTypeZodValidator = createZodObjectTypeValidator(schema);
