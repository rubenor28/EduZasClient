import z from "zod";
import { FieldError } from "../entities";

/**
 * Convierte los errores producidos por una validación de Zod
 * en una lista de objetos {@link FieldError}.
 *
 * Esta función facilita el mapeo de la estructura de errores de Zod
 * a un formato uniforme usado en el dominio o capa de presentación.
 *
 * @param error - Instancia de {@link z.ZodError} generada por una validación fallida.
 * @returns Arreglo de {@link FieldError}, donde cada elemento contiene:
 * - `field`: Ruta del campo en el que ocurrió el error (concatenada con ".").
 * - `message`: Descripción del error.
 */
export function zodToFieldErrors(error: z.ZodError): FieldError[] {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}
