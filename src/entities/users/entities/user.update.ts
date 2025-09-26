import type { User } from "./user";

/**
 * DTO para actualizar un usuario existente.
 *
 * @remarks Omite solo los campos de auditoría (`createdAt`, `modifiedAt`).
 */
export type UserUpdate = Omit<User, "createdAt" | "modifiedAt">;
