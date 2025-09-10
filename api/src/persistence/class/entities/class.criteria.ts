import { Criteria } from "persistence/common/entities";
import { StringQuery } from "persistence/common/entities";
import { Class } from "./class";

/**
 * Criterios de búsqueda específicos para entidades {@link Class}.
 *
 * Combina:
 * - {@link Criteria}: parámetros comunes de paginación.
 * - `Partial<Pick<Class, "ownerId">>`: permite filtrar opcionalmente por `ownerId`.
 * - Campos de cadena (`className`, `subject`, `section`) que aceptan {@link StringQuery}.
 *
 * Uso típico en consultas a repositorios o endpoints de búsqueda.
 *
 * @example
 * // Buscar todas las clases de un usuario con coincidencia parcial en el nombre
 * const criteria: ClassCriteria = {
 *   page: 1,
 *   ownerId: 42,
 *   className: { string: "matemática", searchType: StringSearchType.LIKE }
 * };
 */
export type ClassCriteria = Criteria &
  Partial<Pick<Class, "ownerId">> & {
    /** Nombre descriptivo de la clase */
    className?: StringQuery;
    /** Materia asociada a la clase */
    subject?: StringQuery;
    /** Información adicional de la clase */
    section?: StringQuery;
  };
