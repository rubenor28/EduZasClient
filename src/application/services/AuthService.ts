import type { Result, UserDomain } from "@domain";
import type {
  NewUserDTO,
  UserCredentialsDTO,
  ServiceErrorsDTO,
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
  signIn(data: NewUserDTO): Promise<Result<UserDomain, ServiceErrorsDTO>>;

  /**
   * Inicia sesión con las credenciales proporcionadas.
   *
   * @param creds - Credenciales de acceso (correo y contraseña)
   * @returns Un `Result` vacío en caso de éxito o una lista de errores de validación
   */
  login(
    creds: UserCredentialsDTO,
  ): Promise<Result<UserDomain, ServiceErrorsDTO>>;

  /**
   * Verifica si el usuario está autenticado y obtiene los datos
   * del usuario.
   * @returns Un `Result` con los datos de usuario en caso de
   * éxito o una lista de errores de validación
   */
  isAuth(): Promise<Result<UserDomain, ServiceErrorsDTO>>;

  /**
   * Cierra la sesión del usuario actual.
   */
  logout(): Promise<Result<void, ServiceErrorsDTO>>;
}
