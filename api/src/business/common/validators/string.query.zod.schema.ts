import { StringSearchType } from "persistence/common/enums";
import z from "zod";

/**
 * Esquema Zod para búsquedas de texto en campos de usuario.
 *
 * Representa un filtro de tipo `StringQuery` con:
 * - string: la cadena a buscar (mínimo 1 carácter).
 * - searchType: tipo de búsqueda (`StringSearchType` enum) que define
 *   la forma de comparar el texto (ej: exacta, parcial, etc.).
 */
export const stringQueryZodSchema = z.object({
  string: z.string().min(1),
  searchType: z.enum(StringSearchType),
});
