import type { Criteria, StringQuery } from "./common";

/** DTO para la creación de un nuevo usuario. */
export type NewUser = {
  /** Primer nombre. */
  firstName: string;
  /** Apellido paterno. */
  fatherLastname: string;
  /** Correo electrónico. */
  email: string;
  /** Contraseña inicial. */
  password: string;
  /** Apellido materno (opcional). */
  motherLastname?: string;
  /** Segundo nombre (opcional). */
  midName?: string;
  /** Rol asignado. */
  role: number;
};

/** DTO para la actualización de un usuario existente. */
export type UpdateUser = {
  /** ID del usuario a actualizar. */
  id: number;
  /** Estado de activación. */
  active: boolean;
  /** Rol asignado. */
  role: number;
  /** Primer nombre. */
  firstName: string;
  /** Apellido paterno. */
  fatherLastname: string;
  /** Correo electrónico. */
  email: string;
  /** Nueva contraseña (si se desea cambiar). */
  password: string | null;
  /** Segundo nombre (opcional). */
  midName?: string;
  /** Apellido materno (opcional). */
  motherLastname?: string;
};

/** Criterios de búsqueda para usuarios. */
export type UserCriteria = Criteria & {
  /** Filtrar por estado activo/inactivo. */
  active?: boolean;
  /** Filtrar por rol. */
  role?: number;
  /** Filtrar por nombre. */
  firstName?: StringQuery;
  /** Filtrar por segundo nombre. */
  midName?: StringQuery;
  /** Filtrar por apellido paterno. */
  fatherLastname?: StringQuery;
  /** Filtrar por apellido materno. */
  motherLastname?: StringQuery;
  /** Filtrar por correo electrónico. */
  email?: StringQuery;
  /** Filtrar por contraseña (no recomendado). */
  password?: StringQuery;
  /** Filtrar por fecha de creación. */
  createdAt?: Date;
  /** Filtrar por fecha de modificación. */
  modifiedAt?: Date;
};
