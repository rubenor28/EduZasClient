import z from "zod";
import { Gender } from "persistence/users/enums";
import { createZodObjectTypeValidator } from "business/common/validators/zod/zod.validator";

/**
 * Esquema Zod que describe la forma esperada para la creación de un usuario (NewUser).
 *
 * Campos:
 * - tuition: cadena obligatoria.
 * - firstName: cadena obligatoria.
 * - midName: cadena opcional.
 * - fatherLastname: cadena obligatoria.
 * - motherLastname: cadena opcional.
 * - gender: variante opcional del enum `Gender`.
 * - email: cadena obligatoria (no valida formato de correo).
 * - password: cadena obligatoria.
 */
export const newUserSchema = z.object({
  tuition: z.string(),
  firstName: z.string(),
  midName: z.string().optional(),
  fatherLastname: z.string(),
  motherLastname: z.string().optional(),
  gender: z.enum(Gender).optional(),
  email: z.string(),
  password: z.string(),
});

/**
 * Validador de tipo de objeto para `NewUser`.
 *
 * Crea un validador específico a partir del esquema Zod `newUserSchema`
 * mediante la fábrica `createZodObjectTypeValidator`.
 *
 * - Entrada: `unknown`
 * - Salida: `ObjectTypeValidation<NewUser>` (éxito con valor refinado o fallo con FieldError[]).
 *
 * Campos:
 * - tuition: cadena obligatoria.
 * - firstName: cadena obligatoria.
 * - midName: cadena opcional.
 * - fatherLastname: cadena obligatoria.
 * - motherLastname: cadena opcional.
 * - gender: variante opcional del enum `Gender`.
 * - email: cadena obligatoria (no valida formato de correo).
 * - password: cadena obligatoria.
 *
 * @implements NewUserTypeValidator
 */
export const newUserTypeZodValidator =
  createZodObjectTypeValidator(newUserSchema);
