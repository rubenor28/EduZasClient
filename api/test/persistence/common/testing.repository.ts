import { Repository, offset } from "persistence/common/repositories";
import { Criteria, Identifiable } from "persistence/common/entities";
import { PaginatedQuery } from "persistence/common/entities";

/**
 * Repositorio especializado para **testing** que extiende de {@link Repository}.
 *
 * Define la misma API genérica de operaciones CRUD, pero añade la
 * capacidad de reiniciar completamente el estado del repositorio.
 *
 * @typeParam Id - Tipo del identificador único de la entidad (por ejemplo: `number`, `string`).
 * @typeParam Entity - Tipo de la entidad principal que debe implementar {@link Identifiable}.
 * @typeParam NewEntity - Tipo de datos necesarios para crear una nueva entidad.
 * @typeParam UpdateEntity - Tipo parcial usado para actualizar entidades existentes.
 * @typeParam CriteriaType - Tipo de criterios de búsqueda y filtrado (debe extender {@link Criteria}).
 */
export interface TestingRepository<
  Id,
  Entity extends Identifiable<Id>,
  NewEntity,
  UpdateEntity extends Partial<Entity>,
  CriteriaType extends Criteria,
> extends Repository<Id, Entity, NewEntity, UpdateEntity, CriteriaType> {
  /**
   * Elimina todos los registros almacenados en el repositorio y lo
   * reinicia a su estado inicial, como si acabara de ser creado.
   *
   * Este método es útil en entornos de pruebas (tests) para garantizar
   * que cada caso de prueba comienza con un repositorio vacío y consistente.
   */
  dropData(): void;
}

/**
 * Implementación abstracta de un repositorio **en memoria**, pensada
 * principalmente para entornos de **testing** o prototipado.
 *
 * Maneja las operaciones CRUD sobre un conjunto de entidades almacenadas
 * en un `Map` interno, con soporte opcional para autogeneración de IDs
 * (cuando `Id` es `number`).
 *
 * También incluye soporte para paginación de resultados y la capacidad
 * de resetear el repositorio mediante {@link dropData}.
 *
 * @typeParam Id - Tipo del identificador único de la entidad (ejemplo: `number`, `string`).
 * @typeParam Entity - Tipo de la entidad que debe implementar {@link Identifiable}.
 * @typeParam NewEntity - Tipo de los datos requeridos para crear una nueva entidad.
 * @typeParam UpdateEntity - Tipo parcial usado para actualizar entidades existentes.
 * @typeParam CriteriaType - Tipo de criterios de búsqueda y filtrado (extiende de {@link Criteria}).
 */
export abstract class InMemoryRepository<
  Id,
  Entity extends Identifiable<Id>,
  NewEntity,
  UpdateEntity extends Partial<Entity>,
  CriteriaType extends Criteria,
> implements
    TestingRepository<Id, Entity, NewEntity, UpdateEntity, CriteriaType>
{
  /** Almacén interno de entidades en memoria */
  protected items: Map<Id, Entity> = new Map();

  /** Contador interno para autogenerar IDs numéricos */
  private nextId = 1;

  /**
   * @param pageSize Tamaño de página por defecto para operaciones de paginación. (Default: `10`)
   */
  constructor(private readonly pageSize = 10) {}

  /**
   * Agrega una nueva entidad al repositorio.
   *
   * Si el ID no es proporcionado, este será autogenerado siempre que
   * el tipo de `Id` sea `number`.
   *
   * @param data Datos de la nueva entidad.
   * @returns La entidad completa creada y almacenada.
   * @throws Error si no se proporciona ID y no puede autogenerarse.
   */
  async add(data: NewEntity): Promise<Entity> {
    const entity = this.autoGenerateRemainingFields(data);
    this.items.set(entity.id, entity);
    return entity;
  }

  /**
   * Actualiza una entidad existente en el repositorio.
   *
   * @param data Datos con el `id` de la entidad a actualizar
   *             y los campos a modificar.
   * @returns La entidad actualizada.
   * @throws Error si no existe una entidad con el ID proporcionado.
   */
  async update(data: UpdateEntity): Promise<Entity> {
    if (!data.id) throw new Error("ID requerido para actualizar");

    const current = this.items.get(data.id as Id);
    if (!current) {
      throw new Error(`Entity con id ${String(data.id)} no encontrada`);
    }

    const updated = { ...current, ...data } as Entity;
    this.items.set(updated.id, updated);
    return updated;
  }

  /**
   * Obtiene una entidad por su ID.
   *
   * @param id Identificador de la entidad.
   * @returns La entidad encontrada o `undefined` si no existe.
   */
  async get(id: Id): Promise<Entity | undefined> {
    return this.items.get(id);
  }

  /**
   * Elimina una entidad por su ID.
   *
   * @param id Identificador de la entidad.
   * @returns La entidad eliminada.
   * @throws Error si no existe una entidad con el ID proporcionado.
   */
  async delete(id: Id): Promise<Entity> {
    const entity = this.items.get(id);
    if (!entity) throw new Error(`Entity con id ${String(id)} no encontrada`);
    this.items.delete(id);
    return entity;
  }

  /**
   * Reinicia el repositorio a su estado inicial,
   * eliminando todos los registros y reseteando el contador de IDs.
   */
  dropData(): void {
    this.items = new Map();
    this.nextId = 1;
  }

  /**
   * Busca entidades que cumplan con un criterio.
   *
   * Este método es abstracto y debe ser implementado por
   * cada repositorio específico.
   *
   * @param criteria Criterios de búsqueda y paginación.
   * @returns Un objeto paginado con los resultados encontrados.
   */
  abstract getBy(
    criteria: CriteriaType,
  ): Promise<PaginatedQuery<Entity, CriteriaType>>;

  /**
   * Genera automáticamente los campos faltantes de una nueva entidad
   * (por ejemplo, asignar un ID si aplica).
   *
   * Este método es abstracto y debe ser implementado según las
   * reglas de negocio de la entidad.
   *
   * @param data Datos de entrada para crear la entidad.
   * @returns La entidad completa lista para almacenar.
   */
  abstract autoGenerateRemainingFields(data: NewEntity): Entity;

  /**
   * Aplica paginación sobre un conjunto de resultados.
   *
   * @param criteria Criterios de paginación.
   * @param results Lista completa de resultados a paginar.
   * @returns Un objeto de tipo {@link PaginatedQuery} con la página solicitada.
   */
  protected async paginate(
    criteria: CriteriaType,
    results: Entity[],
  ): Promise<PaginatedQuery<Entity, CriteriaType>> {
    const totalPages = Math.ceil(results.length / this.pageSize);
    const start = offset(this.pageSize, criteria.page);
    const pageResults = results.slice(start, start + this.pageSize);

    return {
      page: criteria.page,
      totalPages,
      criteria,
      results: pageResults,
    };
  }

  /**
   * Retorna todas las entidades almacenadas en el repositorio.
   *
   * @returns Un arreglo con todas las entidades.
   */
  protected all(): Entity[] {
    return Array.from(this.items.values());
  }

  protected autoGenerateId(data: NewEntity): Id {
    const id =
      (("id" in (data as any) && (data as any).id) ||
        (typeof this.nextId === "number"
          ? (this.nextId++ as unknown as Id)
          : undefined)) ??
      undefined;

    if (id === undefined) {
      throw new Error("ID debe ser proporcionado o autogenerable");
    }

    return id;
  }
}
