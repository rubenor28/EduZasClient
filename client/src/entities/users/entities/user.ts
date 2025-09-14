import type { Identifiable } from "entities/common/entities";
import type { Gender, UserType } from "../enums";

/**
 * Representa un usuario completo dentro del sistema, incluyendo
 * campos de autenticación, identidad y metadatos.
 *
 * @extends Identifiable<number>
 */
export type User = Identifiable<number> & {
  /** Matrícula o número de control del usuario. */
  tuition: string;
  /** Nombre de pila del usuario. */
  firstName: string;
  /** Segundo nombre o nombre intermedio del usuario. */
  midName?: string;
  /** Apellido paterno del usuario. */
  fatherLastname: string;
  /** Apellido materno del usuario. */
  motherLastname?: string;
  /** Género del usuario. */
  gender?: Gender;
  /** Tipo de usuario */
  role: UserType;
  /** Dirección de correo electrónico del usuario. */
  email: string;
};
