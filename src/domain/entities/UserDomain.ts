import type { UserType, Identifiable } from "@domain";

/**
 * Representa un usuario dentro del dominio.
 *
 * @remarks
 * Extiende la interfaz {@link Identifiable} para garantizar que
 * cada usuario posea un identificador único de tipo `number`.
 */
export type UserDomain = Identifiable<number> & {
  /** Nombre propio del usuario */
  firstName: string;
  /** Apellido paterno del usuario */
  fatherLastName: string;
  /** Correo electrónico asociado al usuario */
  email: string;
  /** Rol asignado al usuario dentro del sistema */
  role: UserType;
  /** Apellido materno del usuario (opcional) */
  motherLastName?: string;
  /** Segundo nombre del usuario (opcional) */
  midName?: string;
};
