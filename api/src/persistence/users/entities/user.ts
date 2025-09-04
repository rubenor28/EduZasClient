import { Identifiable } from "persistence/common/entities";
import { UserType, Gender } from "../enums";

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
  /** Dirección de correo electrónico del usuario. */
  email: string;
  /** Contraseña del usuario (almacenada de forma segura). */
  password: string;
  /** Tipo de usuario dentro del sistema */
  role: UserType;
  /** Fecha de creación del usuario. */
  createdAt: Date;
  /** Fecha de última modificación del usuario. */
  modifiedAt: Date;
};
