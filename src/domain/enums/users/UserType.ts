/**
 * Enumeración de tipos de usuario dentro del sistema.
 *
 * Define los distintos roles soportados por la aplicación
 * y sus niveles de permisos asociados.
 */
export const UserType = {
  /** Usuario con todos los permisos administrativos */
  ADMIN: 2,
  /** Profesor, con permisos de gestión docente */
  PROFESSOR: 1,
  /** Estudiante, con acceso restringido a su propio perfil y materias */
  STUDENT: 0,
} as const;

/**
 * Tipo utilitario que representa cualquiera de los valores
 * definidos en la constante {@link UserType}.
 *
 * Esto asegura que las variables de este tipo solo puedan contener
 * `"ADMIN" | "PROFESSOR" | "STUDENT"`.
 */
export type UserType = (typeof UserType)[keyof typeof UserType];
