import { createZodBusinessValidator } from "business/common/validators";
import z from "zod";

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

export const publicNewClassBusinessValidator =
  createZodBusinessValidator(schema);
