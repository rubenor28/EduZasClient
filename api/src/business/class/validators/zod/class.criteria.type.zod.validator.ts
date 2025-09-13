import z from "zod";
import {
  uIntZodSchema,
  stringQueryZodSchema,
  createZodObjectTypeValidator,
  criteriaTypeSchema,
} from "business/common/validators";

/**
 * Define el esquema de Zod para los criterios de búsqueda de clases (filtros).
 *
 * Todos los campos son opcionales para permitir búsquedas y paginación flexibles.
 * El campo 'page' tiene un valor por defecto de 1 si no se proporciona.
 *
 * @internal
 */
const schema = z.object({
  id: stringQueryZodSchema.optional(),
  ownerId: uIntZodSchema.optional(),
  subject: stringQueryZodSchema.optional(),
  section: stringQueryZodSchema.optional(),
  className: stringQueryZodSchema.optional(),
}).extend(criteriaTypeSchema);

/**
 * Validador de tipo para objetos de criterios de búsqueda de clases.
 *
 * Construido con Zod, este validador está diseñado para procesar y tipar
 * de forma segura los parámetros de consulta (query params) de una
 * solicitud HTTP antes de utilizarlos para filtrar una lista de clases.
 *
 * Implementa la interfaz `ObjectTypeValidator`, transformando un objeto `unknown`
 * en un objeto de criterios fuertemente tipado.
 */
export const classCriteriaTypeValidator = createZodObjectTypeValidator(schema);
