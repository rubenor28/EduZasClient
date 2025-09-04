/**
 * Tipo que representa las credenciales de autenticación de un usuario.
 */
export type UserCredentials = {
  /** Dirección de correo electrónico del usuario. */
  email: string;
  /** Contraseña del usuario en texto plano. */
  password: string;
};

/**
 * Ejemplo de objeto `UserCredentials` con todas las claves inicializadas.
 * Se utiliza para obtener las claves tipadas en tiempo de ejecución.
 */
const userCredentialsWithAllKeys: UserCredentials = {
  email: "",
  password: "",
};

/**
 * Claves del tipo {@link UserCredentials} tipadas para usar en tiempo de ejecución.
 *
 * @remarks
 * Se obtiene a partir de `userCredentialsWithAllKeys` para garantizar que los
 * `keyof ` sean consistentes con el tipo TypeScript.
 *
 * @example
 * ```ts
 * USER_CREDENTIALS_KEYS.forEach((key) => {
 *   console.log(key); // "email", "password"
 * });
 * ```
 */
export const USER_CREDENTIALS_KEYS = Object.keys(
  userCredentialsWithAllKeys,
) as (keyof UserCredentials)[];
