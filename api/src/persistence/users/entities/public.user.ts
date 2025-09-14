import { User } from "./user";

/**
 * DTO para exponer datos públicos de un usuario.
 *
 * @remarks Omite `password`, `createdAt` y `modifiedAt` por seguridad.
 */
export type PublicUser = Omit<
  User,
  "password" | "createdAt" | "modifiedAt"
>;
