import type {
  NewUserDTO,
  UpdateUserDTO,
  User,
  UserCriteriaDTO,
} from "../model";
import type { User as PrismaUser } from "@prisma/client";
import { PAGE_SIZE, prisma } from "../config";
import { optionalStringQueryToPrisma } from "../parsers/prisma.parser";
import { offset, type Repository } from "./repository";

/**
 * Implementación de repositorio para la entidad `User` usando Prisma ORM.
 *
 * Proporciona las operaciones CRUD y búsqueda paginada basadas en los criterios
 * definidos.
 *
 * @implements Repository<number, User, NewUserDTO, UpdateUserDTO, UserCriteriaDTO>
 */
export const prismaUserRepository: Repository<
  number,
  User,
  NewUserDTO,
  UpdateUserDTO,
  UserCriteriaDTO
> = {
  /**
   * Crea un nuevo usuario en el sistema.
   *
   * @param data - Datos necesarios para crear el usuario.
   * @returns El usuario creado.
   */
  async add(data) {
    const createdUser = await prisma.user.create({
      data: {
        active: true,
        ...data,
      },
    });

    return normalizeUser(createdUser);
  },

  /**
   * Obtiene un usuario por su identificador único.
   *
   * @param id - Identificador del usuario.
   * @returns El usuario encontrado o `undefined` si no existe.
   */
  async get(id) {
    const record = await prisma.user.findUnique({ where: { id } });
    return record ? normalizeUser(record) : undefined;
  },

  /**
   * Elimina un usuario por su identificador.
   *
   * @param id - Identificador del usuario a eliminar.
   * @returns El usuario eliminado.
   */
  async delete(id) {
    const deleted = await prisma.user.delete({ where: { id } });
    return normalizeUser(deleted);
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

    return normalizeUser(updated);
  },

  /**
   * Obtiene una lista paginada de usuarios que coinciden con los criterios indicados.
   *
   * @param criteria - Criterios para filtrar la búsqueda.
   * @param page - Número de página (basado en 1).
   * @returns Resultado paginado con la lista de usuarios y metadata.
   */
  async getBy(criteria, page) {
    const {
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
      gender: optionalStringQueryToPrisma(gender),
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

    const results = rawResults.map(normalizeUser);

    return {
      page,
      totalPages: Math.ceil(totalRecords / PAGE_SIZE),
      criteria,
      results,
    };
  },
};

/**
 * Normaliza un registro `PrismaUser` a la entidad de dominio `User`,
 * ajustando propiedades opcionales para que sean `undefined` en vez de `null`.
 *
 * @param user - Registro obtenido desde Prisma.
 * @returns Usuario normalizado compatible con la entidad de dominio.
 */
const normalizeUser = (user: PrismaUser): User => {
  const { motherLastname, midName, gender, ...rest } = user;
  return {
    ...rest,
    motherLastname: motherLastname ?? undefined,
    midName: midName ?? undefined,
    gender: gender ?? undefined,
  };
};
