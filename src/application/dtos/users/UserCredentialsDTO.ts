/**
 * Representa las credenciales de autenticación de un usuario.
 *
 * @remarks
 * Este DTO encapsula la información mínima requerida para iniciar sesión
 * en el sistema: correo electrónico y contraseña.
 */
export type UserCredentialsDTO = {
  /** Correo electrónico del usuario */
  email: string;
  /** Contraseña asociada al usuario */
  password: string;
};
