import type {
  FieldErrorDTO,
  Identifiable,
  PaginatedQuery,
  Criteria as CriteriaType,
} from "../model";
import type { Repository } from "../repository/repository";
import { Result, Ok, Err } from "ts-results";

/**
 * Interfaz para validadores de CRUD desacoplados de la infraestructura.
 *
 * @template Id          Tipo del identificador único de la entidad.
 * @template Entity      Tipo de la entidad persistida, debe extender Identifiable<Id>.
 * @template NewEntity   Tipo de los datos requeridos para crear una nueva entidad.
 * @template UpdateEntity Tipo de los datos para actualizar una entidad existente.
 * @template Criteria    Tipo de los criterios de búsqueda/paginación.
 */
export interface CrudServiceValidator<
  Id,
  Entity extends Identifiable<Id>,
  NewEntity,
  UpdateEntity,
  Criteria extends CriteriaType,
> {
  /**
   * Valida los datos para crear una nueva entidad.
   *
   * @param data - Datos de la nueva entidad.
   * @param repo - Repositorio inyectado para operaciones de persistencia.
   * @returns Ok si la validación pasa, o Err con un arreglo de FieldErrorDTO si falla.
   */
  validateNew(
    data: NewEntity,
    repo: Repository<Id, Entity, NewEntity, UpdateEntity, Criteria>,
  ): Promise<Result<void, FieldErrorDTO[]>>;

  /**
   * Valida los datos para actualizar una entidad existente.
   *
   * @param data - Datos de la entidad con cambios aplicados.
   * @param repo - Repositorio inyectado para operaciones de persistencia.
   * @returns Ok si la validación pasa, o Err con un arreglo de FieldErrorDTO si falla.
   */
  validate(
    data: UpdateEntity,
    repo: Repository<Id, Entity, NewEntity, UpdateEntity, Criteria>,
  ): Promise<Result<void, FieldErrorDTO[]>>;
}

/**
 * Servicio genérico para operaciones CRUD sobre una entidad.
 *
 * @template Id            Tipo del identificador único de la entidad.
 * @template Entity        Tipo de la entidad persistida; debe extender `Identifiable<Id>`.
 * @template NewEntity     Tipo de los datos necesarios para crear una nueva entidad.
 * @template UpdateEntity  Tipo de los datos para actualizar una entidad existente.
 * @template Criteria      Tipo de los criterios de búsqueda/paginación.
 */
export class CrudService<
  Id,
  Entity extends Identifiable<Id>,
  NewEntity,
  UpdateEntity,
  Criteria extends CriteriaType,
> {
  private repo: Repository<Id, Entity, NewEntity, UpdateEntity, Criteria>;
  private validator: CrudServiceValidator<
    Id,
    Entity,
    NewEntity,
    UpdateEntity,
    Criteria
  >;

  /**
   * Crea una instancia de `CrudService`.
   *
   * @param options.repo      Repositorio que implementa las operaciones de persistencia.
   * @param options.validator Validador para crear y actualizar entidades.
   */
  constructor(options: {
    repo: Repository<Id, Entity, NewEntity, UpdateEntity, Criteria>;
    validator: CrudServiceValidator<
      Id,
      Entity,
      NewEntity,
      UpdateEntity,
      Criteria
    >;
  }) {
    this.repo = options.repo;
    this.validator = options.validator;
  }

  /**
   * Agrega una nueva entidad tras validar sus datos.
   *
   * @param data - Datos de la nueva entidad.
   * @returns `Ok(Entity)` si la creación fue exitosa, o `Err(FieldErrorDTO[])` con errores de validación.
   */
  async add(data: NewEntity): Promise<Result<Entity, FieldErrorDTO[]>> {
    const validation = await this.validator.validateNew(data, this.repo);
    if (validation.err) return Err(validation.val);
    const created = await this.repo.add(data);
    return Ok(created);
  }

  /**
   * Actualiza una entidad existente luego de validarla.
   *
   * @param data - Datos de la entidad con los cambios a aplicar.
   * @returns `Ok(Entity)` si la actualización fue exitosa, o `Err(FieldErrorDTO[])` con errores de validación.
   */
  async update(data: UpdateEntity): Promise<Result<Entity, FieldErrorDTO[]>> {
    const validation = await this.validator.validate(data, this.repo);
    if (validation.err) return Err(validation.val);
    const updated = await this.repo.update(data);
    return Ok(updated);
  }

  /**
   * Obtiene una entidad por su identificador.
   *
   * @param id - Identificador único de la entidad.
   * @returns La entidad si se encuentra, o `undefined` en caso contrario.
   */
  async get(id: Id): Promise<Entity | undefined> {
    return this.repo.get(id);
  }

  /**
   * Elimina una entidad si existe, identificada por su ID.
   *
   * @param id - Identificador único de la entidad.
   * @returns `Ok(Entity)` con la entidad eliminada, o `Err(string)` si no se encuentra.
   */
  async delete(id: Id): Promise<Result<Entity, string>> {
    const found = await this.repo.get(id);
    if (!found) return Err("Registro no encontrado");
    const removed = await this.repo.delete(id);
    return Ok(removed);
  }

  /**
   * Busca entidades según criterios y paginación.
   *
   * @param criteria - Criterios de búsqueda (pagina, campos, texto, fechas, etc.).
   * @returns `Ok(Entity[])` con la lista de entidades o `Err(FieldErrorDTO[])` si hay errores.
   */
  async getBy(criteria: Criteria): Promise<PaginatedQuery<Entity, Criteria>> {
    return this.repo.getBy(criteria);
  }
}
