/**
 * Define la información necesaria para registrar un nuevo usuario.
 *
 * @remarks
 * Incluye los datos personales básicos y las credenciales de acceso.
 */
export type NewUserDTO = {
  /** Nombre del usuario */
  firstName: string;
  /** Apellido paterno del usuario */
  fatherLastName: string;
  /** Segundo nombre del usuario (opcional) */
  midName?: string;
  /** Apellido materno del usuario (opcional) */
  motherLastName?: string;
  /** Correo electrónico del usuario */
  email: string;
  /** Contraseña de acceso del usuario */
  password: string;
};
