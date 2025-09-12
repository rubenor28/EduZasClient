import {
  createZodObjectTypeValidator,
  uIntZodSchema,
} from "business/common/validators";
import z from "zod";

const schema = z.object({
  className: z
    .string("El nombre de la clase debe ser una cadena"),
  subject: z
    .string("El nombre de la materia debe ser una cadena")
    .optional(),
  section: z
    .string("El nombre de la sección debe ser una cadena")
    .optional(),
  ownerId: uIntZodSchema,
});

export const publicNewClassTypeValidator = createZodObjectTypeValidator(schema);
