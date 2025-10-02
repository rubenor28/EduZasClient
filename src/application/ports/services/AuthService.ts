import {
  UserType,
  type AuthErrors,
  type Result,
  type UserDomain,
} from "@domain";
import type {
  FieldErrorDTO,
  NewUserDTO,
  UserCredentialsDTO,
} from "@application";

/**
 * Define la interfaz para el servicio de autenticación de usuarios.
 *
 * @remarks
 * Expone operaciones para registrar usuarios, iniciar sesión,
 * verificar el estado de autenticación y cerrar sesión.
 * Utiliza el tipo `Result` para un manejo seguro de errores.
 */
export interface AuthService {
  /**
   * Registra un nuevo usuario en el sistema.
   *
   * @param data - Datos requeridos para el registro del usuario
   * @returns Un `Result` con el usuario creado o una lista de errores de validación
   */
  signIn(data: NewUserDTO): Promise<Result<UserDomain, FieldErrorDTO[]>>;

  /**
   * Inicia sesión con las credenciales proporcionadas.
   *
   * @param creds - Credenciales de acceso (correo y contraseña)
   * @returns Un `Result` vacío en caso de éxito o una lista de errores de validación
   */
  login(
    creds: UserCredentialsDTO,
  ): Promise<Result<UserDomain, FieldErrorDTO[]>>;

  /**
   * Verifica si el usuario actual está autenticado.
   *
   * @returns El usuario autenticado si existe, variante de `AuthErrors` para indicar
   * una sesión inactiva o falta de permisos
   */
  isAuth(): Promise<Result<UserDomain, AuthErrors>>;

  /**
   * Cierra la sesión del usuario actual.
   */
  logout(): Promise<void>;
}

/**
 * Verifica si el rol de usuario es Profesor o Administrador
 * @param role - Tipo de usuario a verificar
 * @returns `true` si el rol es Profesor o Administrador, `false` en caso contrario
 */
export const isProfessorOrAdmin = (role: UserType) =>
  role === UserType.PROFESSOR || role === UserType.ADMIN;

/**
 * Verifica si el rol de usuario es exclusivamente Administrador
 * @param role - Tipo de usuario a verificar
 * @returns `true` si el rol es Administrador, `false` en caso contrario
 */
export const isAdmin = (role: UserType) => role === UserType.ADMIN;

/**
 * Verifica si el rol de usuario es exclusivamente Profesor
 * @param role - Tipo de usuario a verificar
 * @returns `true` si el rol es Profesor, `false` en caso contrario
 */
export const isProfessor = (role: UserType) => role === UserType.PROFESSOR;
