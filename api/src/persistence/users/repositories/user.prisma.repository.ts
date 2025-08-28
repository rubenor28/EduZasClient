import { Err, Ok } from "ts-results";
import { offset } from "persistence/common/repositories";
import { UserRepository } from "./user.repository";
import { PAGE_SIZE, prisma } from "config";
import { mapPrismaUserToBuisness } from "../mappers";
import { optionalStringQueryToPrisma } from "persistence/common/mappers";

/**
 * Implementación de repositorio para la entidad `User` usando Prisma ORM.
 *
 * Proporciona las operaciones CRUD y búsqueda paginada basadas en los criterios
 * definidos.
 *
 * @implements Repository<number, User, NewUserDTO, UpdateUserDTO, UserCriteriaDTO>
 */
export const userPrismaRepository: UserRepository = {
  /**
   * Crea un nuevo usuario en el sistema.
   *
   * @param data - Datos necesarios para crear el usuario.
   * @returns El usuario creado.
   */
  async add(data) {
    const createdUser = await prisma.user.create({
      data: {
        ...data,
      },
    });

    return mapPrismaUserToBuisness(createdUser);
  },

  /**
   * Obtiene un usuario por su identificador único.
   *
   * @param id - Identificador del usuario.
   * @returns El usuario encontrado o `undefined` si no existe.
   */
  async get(id) {
    const record = await prisma.user.findUnique({ where: { id } });
    return record ? mapPrismaUserToBuisness(record) : undefined;
  },

  /**
   * Elimina un usuario por su identificador.
   *
   * @param id - Identificador del usuario a eliminar.
   * @returns El usuario eliminado.
   */
  async delete(id) {
    const deleted = await prisma.user.delete({ where: { id } });
    return mapPrismaUserToBuisness(deleted);
  },

  /**
   * Actualiza un usuario existente.
   *
   * @param data - Datos actualizados del usuario.
   * @returns El usuario actualizado.
   */
  async update(data) {
    const updated = await prisma.user.update({
      where: { id: data.id },
      data,
    });

    return mapPrismaUserToBuisness(updated);
  },

  /**
   * Obtiene una lista paginada de usuarios que coinciden con los criterios indicados.
   *
   * @param criteria - Criterios para filtrar la búsqueda.
   * @param page - Número de página (basado en 1).
   * @returns Resultado paginado con la lista de usuarios y metadata.
   */
  async getBy(criteria) {
    const {
      page,
      gender,
      motherLastname,
      midName,
      email,
      tuition,
      firstName,
      fatherLastname,
      ...rest
    } = criteria;

    const where = {
      ...rest,
      motherLastname: optionalStringQueryToPrisma(motherLastname),
      midName: optionalStringQueryToPrisma(midName),
      email: optionalStringQueryToPrisma(email),
      tuition: optionalStringQueryToPrisma(tuition),
      firstName: optionalStringQueryToPrisma(firstName),
      fatherLastname: optionalStringQueryToPrisma(fatherLastname),
    };

    const [totalRecords, rawResults] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip: offset(PAGE_SIZE, page),
        take: PAGE_SIZE,
      }),
    ]);

    const results = rawResults.map(mapPrismaUserToBuisness);

    return {
      page,
      totalPages: Math.ceil(totalRecords / PAGE_SIZE),
      criteria,
      results,
    };
  },

  async getPasswordHash(email) {
    const result = await prisma.user.findUnique({
      where: { email },
      select: { password: true },
    });

    if (result === null) return Err.EMPTY;

    return Ok(result.password);
  },

  async emailIsRegistered(email) {
    const id = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    return id !== null;
  },

  async findByTuition(tuition) {
    const record = await prisma.user.findUnique({
      where: { tuition },
    });

    return record ? mapPrismaUserToBuisness(record) : undefined;
  },
};
