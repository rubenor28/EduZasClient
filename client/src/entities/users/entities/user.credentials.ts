/**
 * Tipo que representa las credenciales de autenticación de un usuario.
 */
export type UserCredentials = {
  /** Dirección de correo electrónico del usuario. */
  email: string;
  /** Contraseña del usuario en texto plano. */
  password: string;
};

const userCredentialsWithAllKeys: UserCredentials = {
  email: "",
  password: "",
};

export const USER_CREDENTIALS_KEYS = Object.keys(
  userCredentialsWithAllKeys,
) as (keyof UserCredentials)[];
