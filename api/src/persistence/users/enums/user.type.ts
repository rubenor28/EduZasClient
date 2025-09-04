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
