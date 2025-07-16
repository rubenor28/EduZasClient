import type { FieldErrorDTO, Identifiable } from "../model";
import type { Repository } from "../repository/repository";
import { Result, Ok, Err } from "ts-results";

/**
 * Crea un servicio CRUD genérico desacoplado del framework, mediante composición funcional.
 *
 * Esta función implementa el patrón **Factory**, permitiendo construir servicios CRUD con
 * validaciones personalizadas y lógica de búsqueda específica para cada entidad.
 *
 * @template Id - Tipo del identificador único (por ejemplo: `number`, `string`).
 * @template Entity - Tipo completo de la entidad persistida, debe implementar `Identifiable<Id>`.
 * @template NewEntity - Tipo de los datos requeridos para crear una nueva entidad.
 * @template Criteria - Tipo del objeto de filtrado/búsqueda.
 *
 * @param repo - Repositorio que implementa operaciones de persistencia.
 * @param validateNew - Función de validación para nuevas entidades.
 * @param validate - Función de validación para entidades existentes (actualización).
 * @param getBy - Función que implementa la lógica de filtrado/paginación.
 *
 * @returns Un objeto con métodos `add`, `update`, `get`, `delete` y `getBy`.
 */
export function createCrudService<
  Id,
  Entity extends Identifiable<Id>,
  NewEntity,
  UpdateEntity,
  Criteria,
>({
  repo,
  validateNew,
  validate,
  getBy,
}: {
  repo: Repository<Id, Entity, NewEntity, UpdateEntity, Criteria>;
  validateNew: (data: NewEntity) => Result<void, FieldErrorDTO[]>;
  validate: (data: UpdateEntity) => Result<void, FieldErrorDTO[]>;
  getBy: (
    criteria: Criteria,
    page: number,
  ) => Promise<Result<Entity[], FieldErrorDTO[]>>;
}) {
  return {
    /**
     * Agrega una nueva entidad tras validar sus datos.
     *
     * @param data - Datos de la nueva entidad.
     * @returns Resultado exitoso con la entidad creada, o lista de errores de validación.
     */
    async add(data: NewEntity): Promise<Result<Entity, FieldErrorDTO[]>> {
      const validation = validateNew(data);
      if (validation.err) return Err(validation.val);
      return Ok(await repo.add(data));
    },

    /**
     * Actualiza una entidad existente luego de validarla.
     *
     * @param data - Entidad con los cambios aplicados.
     * @returns Resultado exitoso con la entidad actualizada, o lista de errores de validación.
     */
    async update(data: UpdateEntity): Promise<Result<Entity, FieldErrorDTO[]>> {
      const validation = validate(data);
      if (validation.err) return Err(validation.val);
      return Ok(await repo.update(data));
    },

    /**
     * Obtiene una entidad por su identificador.
     *
     * @param id - Identificador único de la entidad.
     * @returns La entidad encontrada o `undefined` si no existe.
     */
    async get(id: Id): Promise<Entity | undefined> {
      return repo.get(id);
    },

    /**
     * Elimina una entidad si existe, identificada por su ID.
     *
     * @param id - Identificador único de la entidad.
     * @returns Resultado exitoso con la entidad eliminada, o un error si no se encuentra.
     */
    async delete(id: Id): Promise<Result<Entity, string>> {
      const found = await repo.get(id);
      if (!found) return Err("Registro no encontrado");
      return Ok(await repo.delete(id));
    },

    /**
     * Busca entidades por los criterios especificados y paginación.
     *
     * @param criteria - Criterios de búsqueda (por campos, texto, fechas, etc.).
     * @param page - Número de página para resultados paginados.
     * @returns Resultado exitoso con lista de entidades, o errores de validación si aplica.
     */
    async getBy(criteria: Criteria, page: number) {
      return getBy(criteria, page);
    },
  };
}
