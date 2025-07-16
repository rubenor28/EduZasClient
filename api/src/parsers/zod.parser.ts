import z from "zod";
import type { FieldErrorDTO } from "../model";

// Función auxiliar para mapear errores de Zod
export function zodToFieldErrors(error: z.ZodError): FieldErrorDTO[] {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}
