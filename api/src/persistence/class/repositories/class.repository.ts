import { Repository } from "persistence/common/repositories";
import { Class, ClassCriteria, ClassUpdate, NewClass } from "../entities";

/**
 * Repositorio especializado para manejar entidades {@link Class}.
 *
 * Extiende de la interfaz genérica {@link Repository} definiendo
 * los tipos específicos para el agregado `Class`:
 *
 * - `Id`: `string` → identificador único de la clase.
 * - `Entity`: {@link Class} → entidad principal del dominio.
 * - `NewEntity`: {@link NewClass} → datos requeridos para crear una clase.
 * - `UpdateEntity`: {@link ClassUpdate} → datos requeridos para actualizar una clase.
 * - `Criteria`: {@link ClassCriteria} → criterios de filtrado y búsqueda.
 *
 * Esto garantiza consistencia tipada en operaciones CRUD y consultas
 * relacionadas con clases académicas.
 *
 * @example
 * // Recuperar una clase por ID
 * const classRepo: ClassRepository = ...;
 * const c = await classRepo.get("abc123");
 *
 * @example
 * // Crear una nueva clase
 * const newClass: NewClass = {
 *   className: "Matemáticas",
 *   subject: "Álgebra",
 *   section: "A"
 * };
 * const created = await classRepo.add(newClass);
 *
 * @example
 * // Buscar clases por criterios
 * const results = await classRepo.getBy({
 *   page: 1,
 *   subject: { string: "física", searchType: StringSearchType.LIKE }
 * });
 */
export interface ClassRepository
  extends Repository<string, Class, Class, ClassUpdate, ClassCriteria> {}
