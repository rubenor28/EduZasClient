import z from "zod";
import { createZodBusinessValidator } from "business/common/validators";
import {
  compositeNameRegex,
  passwordRegex,
  simpleNameRegex,
  tuitionRegex,
} from "../regexs";

/**
 * Función auxiliar para validar nombres compuestos.
 *
 * Rechaza nombres que no coincidan con `simpleNameRegex` ni `compositeNameRegex`.
 *
 * @param name - Nombre a validar.
 * @returns `true` si el nombre es válido, `false` si es inválido.
 */
const compositeNameValidation = (name: string) =>
  simpleNameRegex.test(name) || compositeNameRegex.test(name);

/**
 * Esquema Zod para la validación de creación de usuario (`NewUser`).
 *
 * Campos validados:
 * - tuition: debe cumplir `tuitionRegex`.
 * - firstName: debe cumplir `simpleNameRegex`.
 * - midName: opcional, debe pasar `compositeNameValidation`.
 * - fatherLastname: debe cumplir `simpleNameRegex`.
 * - motherLastname: opcional, debe pasar `compositeNameValidation`.
 * - email: formato de correo válido.
 * - password: debe cumplir `passwordRegex`.
 *
 * Mensajes de error específicos se proporcionan en cada campo para facilitar
 * la retroalimentación.
 */
// TODO: Validar cadenas vacias
const schema = z.object({
  tuition: z.string().regex(tuitionRegex, "Formato de matricula inválida"),
  firstName: z.string().regex(simpleNameRegex, "Formato de nombre inválido"),
  midName: z
    .string()
    .refine(compositeNameValidation, { error: "Formato de nombre inválido" })
    .optional(),
  fatherLastname: z
    .string()
    .regex(simpleNameRegex, "Formato de apellido inválido"),
  motherLastname: z
    .string()
    .refine(compositeNameValidation, { error: "Formato de apellido inválido" })
    .optional(),
  email: z.email("Formato de email inválido"),
  password: z.string().regex(passwordRegex, "Formato de contraseña inválido"),
});

/**
 * Validador de negocio para la creación de un usuario (`NewUser`).
 *
 * - Genera un `BusinessValidator<NewUser>` usando `createZodBusinessValidator`.
 * - Entrada: `NewUser` u objeto compatible.
 * - Salida: `BusinessValidation<FieldError[]>` indicando éxito o errores de validación.
 *
 * Campos validados:
 * - tuition: debe cumplir `tuitionRegex`.
 * - firstName: debe cumplir `simpleNameRegex`.
 * - midName: opcional, debe cumplit `simpleNameRegex` o `compositeNameRegex`.
 * - fatherLastname: debe cumplir `simpleNameRegex`.
 * - motherLastname: opcional, debe cumplit `simpleNameRegex` o `compositeNameRegex`.
 * - email: formato de correo válido.
 * - password: debe cumplir `passwordRegex`.
 *
 */
export const newUserBusinessZodValidator = createZodBusinessValidator(schema);
