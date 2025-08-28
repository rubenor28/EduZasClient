import z from "zod";
import { Gender, UserType } from "persistence/users/enums";
import { stringQueryZodSchema } from "business/common/validators/string.query.zod.schema";
import { criteriaTypeSchema } from "business/common/validators/zod/criteria.zod.validator";
import { createZodObjectTypeValidator } from "business/common/validators/zod/zod.validator";

/**
 * Esquema Zod que representa los criterios de búsqueda de usuarios.
 *
 * Campos opcionales:
 * - gender: filtro por género (`Gender` enum).
 * - role: filtro por tipo de usuario (`UserType` enum).
 * - createdAt: fecha de creación opcional.
 * - modifiedAt: fecha de modificación opcional.
 * - tuition, firstName, midName, fatherLastname, motherLastname, email:
 *   filtros de texto avanzados con tipo `StringQuery` (permiten búsquedas parciales
 *   o por tipo de coincidencia).
 *
 * Extiende `criteriaSchema` que puede contener otros campos genéricos de paginación o filtrado.
 */
const schema = z
  .object({
    gender: z.enum(Gender).optional(),
    role: z.enum(UserType).optional(),
    createdAt: z.date().optional(),
    modifiedAt: z.date().optional(),
    tuition: stringQueryZodSchema.optional(),
    firstName: stringQueryZodSchema.optional(),
    midName: stringQueryZodSchema.optional(),
    fatherLastname: stringQueryZodSchema.optional(),
    motherLastname: stringQueryZodSchema.optional(),
    email: stringQueryZodSchema.optional(),
  })
  .extend(criteriaTypeSchema);

/**
 * Validador de tipo de objeto para criterios de usuario.
 *
 * Crea un validador específico a partir del esquema `schema` mediante
 * la fábrica `createZodObjectTypeValidator`.
 *
 * - Entrada: `unknown`
 * - Salida: `ObjectTypeValidation<UserCriteriaDTO>` (éxito con valor refinado
 *   o fallo con `FieldError[]`).
 */
export const userCriteriaTypeZodValidator =
  createZodObjectTypeValidator(schema);
