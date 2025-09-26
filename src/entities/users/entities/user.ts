import type { Identifiable } from "entities/common/entities";
import type { UserType } from "../enums";

/**
 * Representa un usuario completo dentro del sistema, incluyendo
 * campos de autenticación, identidad y metadatos.
 *
 * @extends Identifiable<number>
 */
export type User = Identifiable<number> & {
  /** Nombre de pila del usuario. */
  firstName: string;
  /** Segundo nombre o nombre intermedio del usuario. */
  midName?: string;
  /** Apellido paterno del usuario. */
  fatherLastname: string;
  /** Apellido materno del usuario. */
  motherLastname?: string;
  /** Tipo de usuario */
  role: UserType;
  /** Dirección de correo electrónico del usuario. */
  email: string;
};
