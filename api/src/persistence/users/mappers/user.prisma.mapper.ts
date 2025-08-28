import { User as PrismaUser, $Enums } from "@prisma/client";
import { User } from "../entities";
import { Gender, UserType } from "../enums";

/**
 * Convierte un registro de usuario de Prisma en una entidad de negocio {@link User}.
 *
 * - Reemplaza valores `null` por `undefined` en campos opcionales.
 * - Normaliza los enums de Prisma (`Gender`, `UserType`) a los enums de negocio.
 *
 * @param prismaUser - Registro obtenido desde Prisma.
 * @returns Usuario normalizado compatible con la entidad de negocio.
 */
export const mapPrismaUserToBuisness = (prismaUser: PrismaUser): User => {
  const { id, motherLastname, midName, gender, role, ...rest } = prismaUser;

  return {
    ...rest,
    id: Number(id),
    motherLastname: motherLastname ?? undefined,
    midName: midName ?? undefined,
    gender: gender ? mapPrismaGenderToBuisness(gender) : undefined,
    role: mapPrismaUserTypeToBuisness(role),
  };
};

/**
 * Convierte el enum `Gender` de Prisma en el enum de negocio {@link Gender}.
 *
 * @param gender - Valor del enum de Prisma.
 * @returns Valor equivalente del enum de negocio.
 * @throws Error si el valor no corresponde a una opción válida.
 */
export const mapPrismaGenderToBuisness = (gender: $Enums.Gender): Gender => {
  switch (gender) {
    case "MALE":
      return Gender.MALE;
    case "FEMALE":
      return Gender.FEMALE;
    case "OTHER":
      return Gender.OTHER;
    default:
      throw Error("Invalid gender option on user normalization");
  }
};

/**
 * Convierte el enum `UserType` de Prisma en el enum de negocio {@link UserType}.
 *
 * @param type - Valor del enum de Prisma.
 * @returns Valor equivalente del enum de negocio.
 * @throws Error si el valor no corresponde a una opción válida.
 */
export const mapPrismaUserTypeToBuisness = (type: $Enums.UserType): UserType => {
  switch (type) {
    case "ADMIN":
      return UserType.ADMIN;
    case "PROFESSOR":
      return UserType.PROFESSOR;
    case "STUDENT":
      return UserType.STUDENT;
    default:
      throw Error("Invalid user type option on user normalization");
  }
};
