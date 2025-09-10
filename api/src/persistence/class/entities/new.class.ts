import { Class } from "./class";

/**
 * Representa los datos necesarios para crear una nueva clase.
 *
 * Se basa en {@link Class} pero omite:
 * - `id`: porque se genera automáticamente.
 * - `ownerId`: porque se asigna internamente según el usuario autenticado.
 */
export type PublicNewClass = Omit<Class, "id">;
