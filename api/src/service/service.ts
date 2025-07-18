import type { FieldErrorDTO, Identifiable } from "../model";
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
export interface CrudValidator<
  Id,
  Entity extends Identifiable<Id>,
  NewEntity,
  UpdateEntity,
  Criteria,
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
 * Fábrica para crear servicios CRUD.
 *
 * @template Id          Tipo del identificador único de la entidad.
 * @template Entity      Tipo de la entidad persistida, debe extender Identifiable<Id>.
 * @template NewEntity   Tipo de los datos requeridos para crear una nueva entidad.
 * @template UpdateEntity Tipo de los datos para actualizar una entidad existente.
 * @template Criteria    Tipo de los criterios de búsqueda/paginación.
 *
 * @param options.repo      Repositorio que implementa las operaciones de persistencia.
 * @param options.validator Validador para crear y actualizar entidades.
 * @returns Un objeto con métodos `add`, `update`, `get`, `delete` y `getBy` validados.
 */
export function createCrudService<
  Id,
  Entity extends Identifiable<Id>,
  NewEntity,
  UpdateEntity,
  Criteria,
>({
  repo,
  validator,
}: {
  repo: Repository<Id, Entity, NewEntity, UpdateEntity, Criteria>;
  validator: CrudValidator<Id, Entity, NewEntity, UpdateEntity, Criteria>;
}) {
  return {
    /**
     * Agrega una nueva entidad tras validar sus datos.
     *
     * @param data - Datos de la nueva entidad.
     * @returns Resultado con `Ok(Entity)` o `Err(FieldErrorDTO[])`.
     */
    async add(data: NewEntity): Promise<Result<Entity, FieldErrorDTO[]>> {
      const validation = await validator.validateNew(data, repo);
      if (validation.err) return Err(validation.val);
      return Ok(await repo.add(data));
    },

    /**
     * Actualiza una entidad existente luego de validarla.
     *
     * @param data - Entidad con los cambios aplicados.
     * @returns Resultado con `Ok(Entity)` o `Err(FieldErrorDTO[])`.
     */
    async update(data: UpdateEntity): Promise<Result<Entity, FieldErrorDTO[]>> {
      const validation = await validator.validate(data, repo);
      if (validation.err) return Err(validation.val);
      return Ok(await repo.update(data));
    },

    /**
     * Obtiene una entidad por su identificador.
     *
     * @param id - Identificador único de la entidad.
     * @returns La entidad encontrada, o `undefined` si no existe.
     */
    async get(id: Id): Promise<Entity | undefined> {
      return repo.get(id);
    },

    /**
     * Elimina una entidad si existe, identificada por su ID.
     *
     * @param id - Identificador único de la entidad.
     * @returns Resultado con `Ok(Entity)` o `Err(string)` si no la encuentra.
     */
    async delete(id: Id): Promise<Result<Entity, string>> {
      const found = await repo.get(id);
      if (!found) return Err("Registro no encontrado");
      return Ok(await repo.delete(id));
    },

    /**
     * Busca entidades según criterios y paginación.
     *
     * @param criteria - Criterios de búsqueda (campos, texto, fechas, etc.).
     * @param page - Número de página para resultados paginados.
     * @returns Resultado con `Ok(Entity[])` o `Err(FieldErrorDTO[])`.
     */
    async getBy(criteria: Criteria, page: number) {
      return repo.getBy(criteria, page);
    },
  };
}
