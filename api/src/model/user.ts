import type { StringQuery, Identifiable } from "./value_objects";

/**
 * Expresión regular que valida nombres simples compuestos solo por letras mayúsculas,
 * incluyendo caracteres acentuados y la letra Ñ.
 *
 * Ejemplos válidos:
 * - "JUAN"
 * - "ÁNGELA"
 * - "ÑANDÚ"
 */
export const simpleNameRegex = /^[A-ZÁÉÍÓÚÜÑ]+$/;

/**
 * Expresión regular que valida nombres compuestos que comienzan con
 * preposiciones o artículos comunes en nombres en español, seguidos
 * de una palabra en mayúsculas.
 *
 * Ejemplos válidos:
 * - "DE LA CRUZ"
 * - "DEL RÍO"
 * - "LAS FLORES"
 * - "AL ÁNDALUS"
 */
export const compositeNameRegex =
  /^(?:DE\s(?:LA|LAS|LOS|EL)|DEL|DE|LA|LAS|LOS|EL|AL)\s[A-ZÁÉÍÓÚÜÑ]+$/;

/**
 * Expresión regular para validar matrículas (tuition) con el siguiente formato:
 *
 * - 3 letras mayúsculas (pueden incluir acentos o Ñ),
 * - seguidas de una letra que representa el periodo:
 *   - `O`, `I`, `P`, `V`,
 * - seguidas de 6 dígitos.
 *
 * Ejemplos válidos:
 * - `ABC012345`
 * - `ÁÑT012345`
 * - `XYZI123456`
 */
export const tuitionRegex = /^[A-ZÁÉÍÓÚÜÑ]{3}[OIPV]\d{6}$/;

/**
 * Representa un usuario completo dentro del sistema, incluyendo
 * campos de autenticación, identidad y metadatos.
 *
 * @extends Identifiable<number>
 */
export type User = Identifiable<number> & {
  /** Matrícula o número de control del usuario. */
  tuition: string;
  /** Estado de actividad del usuario en el sistema. */
  active: boolean;
  /** Nombre de pila del usuario. */
  firstName: string;
  /** Segundo nombre o nombre intermedio del usuario. */
  midName?: string;
  /** Apellido paterno del usuario. */
  fatherLastname: string;
  /** Apellido materno del usuario. */
  motherLastname?: string;
  /** Género del usuario. */
  gender?: string;
  /** Dirección de correo electrónico del usuario. */
  email: string;
  /** Contraseña del usuario (almacenada de forma segura). */
  password: string;
  /** Fecha de creación del usuario. */
  createdAt: Date;
  /** Fecha de última modificación del usuario. */
  modifiedAt: Date;
};

/**
 * DTO para crear nuevos usuarios.
 *
 * @remarks Omite `id`, `active`, `createdAt` y `modifiedAt`, gestionados por el sistema.
 */
export type NewUserDTO = Omit<
  User,
  "id" | "active" | "createdAt" | "modifiedAt"
>;

/**
 * DTO para actualizar un usuario existente.
 *
 * @remarks Omite solo los campos de auditoría (`createdAt`, `modifiedAt`).
 */
export type UpdateUserDTO = Omit<User, "createdAt" | "modifiedAt">;

/**
 * DTO para exponer datos públicos de un usuario.
 *
 * @remarks Omite `password`, `createdAt` y `modifiedAt` por seguridad.
 */
export type PublicUserDTO = Omit<User, "password" | "createdAt" | "modifiedAt">;

/**
 * DTO para realizar consultas paginadas o filtradas de usuarios.
 *
 * Permite filtrar por fechas (`createdAt`, `modifiedAt`) o realizar búsquedas
 * con `StringQuery` sobre cadenas específicas.
 */
export type UserCriteriaDTO = Partial<
  Pick<User, "createdAt" | "modifiedAt">
> & {
  /** Filtrar por matrícula. */
  tuition?: StringQuery;
  /** Filtrar por nombre de pila. */
  firstName?: StringQuery;
  /** Filtrar por nombre intermedio. */
  midName?: StringQuery;
  /** Filtrar por apellido paterno. */
  fatherLastname?: StringQuery;
  /** Filtrar por apellido materno. */
  motherLastname?: StringQuery;
  /** Filtrar por género. */
  gender?: StringQuery;
  /** Filtrar por correo. */
  email?: StringQuery;
};
