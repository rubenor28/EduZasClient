import { User } from "./user";

/**
 * DTO para crear nuevos usuarios.
 *
 * @remarks Omite `id`, `active`, `createdAt` y `modifiedAt`, gestionados por el sistema.
 */
export type NewUser = Omit<
  User,
  "id" | "active" | "role" | "createdAt" | "modifiedAt"
>;
