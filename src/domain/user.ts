/** Representa un usuario del sistema. */
export type User = {
  /** Identificador único del usuario. */
  id: number;
  /** Indica si el usuario está activo. */
  active: boolean;
  /** Primer nombre. */
  firstName: string;
  /** Segundo nombre (opcional). */
  midName?: string;
  /** Apellido paterno. */
  fatherLastname: string;
  /** Apellido materno (opcional). */
  motherLastname?: string;
  /** Correo electrónico. */
  email: string;
  /** Rol del usuario en el sistema. */
  role: number;
};
