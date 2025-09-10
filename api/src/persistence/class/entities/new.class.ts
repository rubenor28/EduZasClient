import { Class } from "./class";

/**
 * Representa los que debe ingresar un usuario
 * para crear una nueva clase.
 *
 * Se basa en {@link Class} pero omite:
 * - `id`, `createdAt` y `modifiedAt`: porque se
 *   genera automáticamente.
 *
 */
export type NewClass = Omit<Class, "createdAt" | "modifiedAt">;

/**
 * Representa los que debe ingresar un usuario
 * para crear una nueva clase.
 *
 * Se basa en {@link Class} pero omite:
 * - `id`, `createdAt` y `modifiedAt`: porque se
 *   genera automáticamente.
 *
 */
export type PublicNewClass = Omit<NewClass, "id">;
