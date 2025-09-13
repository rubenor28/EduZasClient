import z from "zod";
import { createZodObjectTypeValidator } from "business/common/validators/zod/zod.validator";
import { newUserSchema } from "./new.user.type.zod.validator";

/**
 * Esquema de validación de tipos para la actualización de un usuario.
 *
 * Se construye a partir de:
 * - Un `id` obligatorio, coaccionado a número entero positivo.
 * - Todas las propiedades definidas en {@link newUserSchema}, que representan
 *   los datos básicos requeridos para crear un usuario nuevo.
 *
 * Al usar `.extend(newUserSchema.shape)`, este esquema combina la forma del
 * "nuevo usuario" con la restricción adicional de que el `id` ya debe existir,
 * lo que refleja el caso de **actualización**.
 *
 * @example
 * ```ts
 * // ✅ Válido: actualización de un usuario existente
 * const valid = {
 *   id: "42", // coaccionado a 42
 *   tuition: "A12345",
 *   firstName: "María",
 *   fatherLastname: "Pérez",
 *   email: "maria@example.com",
 * };
 * schema.parse(valid); // pasa validación
 *
 * // ❌ Inválido: id negativo y campos mal tipados
 * const invalid = {
 *   id: -1,                // no es positivo
 *   tuition: 123,          // no es string
 *   firstName: null,       // no es string
 *   email: "texto-plano",  // se espera string (aunque no valida formato de email aquí)
 * };
 * schema.parse(invalid); // lanza error
 * ```
 */
const schema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .extend(newUserSchema.shape);

/**
 * Validador de tipos para actualización de usuarios.
 *
 * Envuelve el esquema en un validador de objetos genérico mediante
 * {@link createZodObjectTypeValidator}, asegurando únicamente
 * la **estructura y tipos de datos**, sin aplicar reglas de negocio
 * adicionales.
 *
 * @example
 * ```ts
 * const result = userUpdateTypeZodValidator.validate({
 *   id: "100",
 *   tuition: "B65432",
 *   firstName: "Luis",
 *   fatherLastname: "García",
 *   email: "luis@example.com",
 * });
 *
 * if (result.success) {
 *   console.log("Usuario válido:", result.value);
 * } else {
 *   console.error("Error de validación:", result.error);
 * }
 * ```
 */
export const userUpdateTypeZodValidator =
  createZodObjectTypeValidator(schema);
