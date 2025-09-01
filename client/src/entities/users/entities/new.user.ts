import { Gender } from "../enums";
import type { User } from "./user";

/**
 * DTO para crear nuevos usuarios.
 *
 * @remarks Omite `id`, `active`, `createdAt` y `modifiedAt`, gestionados por el sistema.
 */
export type NewUser = Omit<
  User,
  "id" | "active" | "role" | "createdAt" | "modifiedAt"
> & { password: string };

/**
 * Ejemplo de objeto `NewUser` con todas las claves inicializadas.
 * Se utiliza para obtener las claves tipadas en tiempo de ejecución.
 */
const newUserWithAllKeys: NewUser = {
  email: "",
  tuition: "",
  firstName: "",
  midName: undefined,
  fatherLastname: "",
  motherLastname: undefined,
  gender: Gender.MALE,
  password: "",
};

/**
 * Claves del tipo {@link NewUser} tipadas para usar en tiempo de ejecución.
 *
 * @remarks
 * Se obtiene a partir de `newUserWithAllKeys` para garantizar que los
 * `keyof NewUser` sean consistentes con el tipo TypeScript.
 *
 * @example
 * ```ts
 * NEW_USER_KEYS.forEach((key) => {
 *   console.log(key); // "email", "tuition", "firstName", ...
 * });
 * ```
 */
export const NEW_USER_KEYS = Object.keys(
  newUserWithAllKeys,
) as (keyof NewUser)[];
