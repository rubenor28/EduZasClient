import { Class as PrismaClass } from "@prisma/client";
import { Class } from "../entities";

/**
 * Convierte una entidad de Prisma (`Class` con alias `PrismaClass`) en una entidad
 * de negocio (`Class`).
 *
 * Prisma puede manejar ciertos campos con tipos distintos a los que
 * se esperan en el dominio. Este mapper ajusta esos casos para
 * mantener consistencia en la capa de negocio.
 *
 * @param prismaClass - Instancia de `Class` proveniente de Prisma.
 * @returns Objeto `Class` en formato del dominio.
 *
 * @example
 * const prismaResult = await prisma.class.findUnique({ where: { id: "abc" } });
 * if (prismaResult) {
 *   const businessClass = mapPrismaClassToBusiness(prismaResult);
 *   // businessClass ahora tiene `ownerId` como number
 * }
 */
export const mapPrismaClassToBusiness = (prismaClass: PrismaClass): Class => {
  const { ownerId } = prismaClass;

  return {
    ...prismaClass,
    ownerId: Number(ownerId),
  };
};
