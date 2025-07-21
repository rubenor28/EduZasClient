import type { StringQuery, Identifiable, Criteria } from "./value_objects";

/**
 * Expresión regular que valida nombres simples compuestos solo por letras mayúsculas,
 * incluyendo caracteres acentuados o la letra Ñ y al menos 3 caracteres.
 *
 * Ejemplos válidos:
 * - "JUAN"
 * - "ÁNGELA"
 * - "ÑANDÚ"
 */
export const simpleNameRegex = /^[A-ZÁÉÍÓÚÜÑ]{3,}$/;

/**
 * Expresión regular que valida nombres compuestos que comienzan con
 * preposiciones o artículos comunes en nombres en español, seguidos
 * de una palabra en mayúsculas y al menos 3 caracteres.
 *
 * Ejemplos válidos:
 * - "DE LA CRUZ"
 * - "DEL RÍO"
 * - "LAS FLORES"
 * - "AL ÁNDALUS"
 */
export const compositeNameRegex =
  /^(?:DE\s(?:LA|LAS|LOS|EL)|DEL|DE|LA|LAS|LOS|EL|AL)\s[A-ZÁÉÍÓÚÜÑ]{3,}$/;

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
 * Expresión regular que valida una contraseña, espera
 * ^ y $ — anclan el inicio y el fin de la cadena, para que toda la contraseña se valide completa.
 *
 * (?=.*[a-z]) — asegura al menos una letra minúscula.
 *
 * (?=.*[A-Z]) — asegura al menos una letra mayúscula.
 *
 * (?=.*[^A-Za-z0-9]) — asegura al menos un carácter especial (cualquier caracter que no sea letra ni dígito).
 *
 * .{8,} — exige un largo mínimo de 8 caracteres (pueden ser cualesquiera, pues los requisitos de contenido ya los verifican los lookahead).
 */
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

/**
 * Tipos de usuario disponibles en el sistema.
 */
export enum UserType {
  /** Usuario con todos los permisos administrativos */
  ADMIN = "ADMIN",
  /** Profesor, con permisos de gestión docente */
  PROFESSOR = "PROFESSOR",
  /** Estudiante, con acceso restringido a su propio perfil y materias */
  STUDENT = "STUDENT",
}

/**
 * Género de una persona o usuario.
 *
 * Este `enum` se utiliza para representar el género de forma explícita
 * y legible, facilitando la validación, visualización y manejo de datos.
 */
export enum Gender {
  /** Género masculino. */
  MALE = "MALE",
  /** Género femenino. */
  FEMALE = "FEMALE",
  /** Otro género o no especificado. */
  OTHER = "OTHER",
}

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

/**
 * DTO para crear nuevos usuarios.
 *
 * @remarks Omite `id`, `active`, `createdAt` y `modifiedAt`, gestionados por el sistema.
 */
export type NewUserDTO = Omit<
  User,
  "id" | "active" | "role" | "createdAt" | "modifiedAt"
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
export type PublicUserDTO = Omit<
  User,
  "password" | "role" | "createdAt" | "modifiedAt"
>;

/**
 * Criterios de búsqueda para realizar consultas paginadas o filtradas de usuarios.
 *
 * Este DTO (Data Transfer Object) extiende el tipo base `Criteria`, permitiendo:
 * - Filtrado por fechas (`createdAt`, `modifiedAt`) mediante coincidencia exacta.
 * - Filtrado flexible por campos de texto usando el tipo `StringQuery`.
 *
 * Puede usarse como estructura de entrada para consultas en endpoints que listan usuarios
 * o realizan búsquedas avanzadas.
 *
 * @see Criteria
 * @see StringQuery
 */
export type UserCriteriaDTO = Criteria &
  Partial<Pick<User, "gender" | "role" | "createdAt" | "modifiedAt">> & 
  {
    /** Filtrar por matrícula del usuario. */
    tuition?: StringQuery;
    /** Filtrar por nombre de pila del usuario. */
    firstName?: StringQuery;
    /** Filtrar por nombre intermedio del usuario (si aplica). */
    midName?: StringQuery;
    /** Filtrar por apellido paterno del usuario. */
    fatherLastname?: StringQuery;
    /** Filtrar por apellido materno del usuario. */
    motherLastname?: StringQuery;
    /** Filtrar por dirección de correo electrónico. */
    email?: StringQuery;
  };
