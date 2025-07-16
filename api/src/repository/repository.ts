import type { Identifiable, PaginatedQuery } from "../model";

/**
 * Interfaz genérica que define el comportamiento para un repositorio.
 *
 * Esta interfaz separa la lógica de persistencia de datos del dominio.
 *
 * @template Id - Tipo del identificador único de la entidad.
 * @template Entity - Tipo de la entidad principal, que debe ser identificable.
 * @template NewEntity - Tipo de los datos requeridos para crear una nueva entidad.
 * @template UpdateEntity - Tipo de los datos requeridos para actualizar una nueva entidad.
 * @template Criteria - Tipo del objeto utilizado para filtrar búsquedas (consultas).
 */
export interface Repository<
  Id,
  Entity extends Identifiable<Id>,
  NewEntity,
  UpdateEntity,
  Criteria,
> {
  /**
   * Crea y almacena una nueva entidad.
   *
   * @param data - Datos para crear la nueva entidad.
   * @returns Una promesa que resuelve con la entidad creada.
   */
  add(data: NewEntity): Promise<Entity>;

  /**
   * Actualiza una entidad existente.
   *
   * @param data - Entidad con los datos actualizados.
   * @returns Una promesa que resuelve con la entidad actualizada.
   */
  update(data: UpdateEntity): Promise<Entity>;

  /**
   * Recupera una entidad por su identificador.
   *
   * @param id - Identificador único de la entidad.
   * @returns Una promesa que resuelve con la entidad encontrada o `undefined` si no existe.
   */
  get(id: Id): Promise<Entity | undefined>;

  /**
   * Elimina una entidad por su identificador.
   *
   * @param id - Identificador de la entidad a eliminar.
   * @returns Una promesa que resuelve con la entidad eliminada.
   */
  delete(id: Id): Promise<Entity>;

  /**
   * Recupera un conjunto de entidades que coincidan con los criterios de búsqueda.
   *
   * @param criteria - Criterios para filtrar entidades.
   * @param page - Número de página para paginación (base 1 o base 0 según convención interna).
   * @returns Una promesa que resuelve con una busqueda paginada con las entidades que coincidan.
   */
  getBy(criteria: Criteria, page: number): Promise<PaginatedQuery<Entity, Criteria>>;
}

/**
 * Calcula el desplazamiento (offset) para una consulta paginada.
 *
 * Este valor se utiliza comúnmente en consultas SQL o APIs paginadas
 * para omitir un número determinado de registros basado en el tamaño de página
 * y el número de página actual.
 *
 * @param pageSize - Cantidad de elementos por página.
 * @param pageNumber - Número de página actual (basado en 1).
 * @returns El número de elementos que deben omitirse (offset).
 *
 * @example
 * // Para obtener la página 2 con 10 elementos por página:
 * offset(10, 2) // => 10
 */
export const offset = (pageSize: number, pageNumber: number) =>
  (pageNumber - 1) * pageSize;

