/**
 * Tipo que representa las credenciales de autenticación de un usuario.
 */
export type UserCredentials = {
  /** Dirección de correo electrónico del usuario. */
  email: string;
  /** Contraseña del usuario en texto plano. */
  password: string;
};
