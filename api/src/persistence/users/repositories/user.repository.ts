import { Result } from "persistence/common/valueObjects";
import { Repository } from "../../common/repositories";
import { NewUser, User, UserCriteria, UserUpdate } from "../entities";

/**
 * Repositorio especializado para la entidad {@link User}.
 *
 * Extiende de la interfaz genérica {@link Repository}, que define las operaciones
 * básicas de persistencia (CRUD) con identificadores numéricos.
 *
 * Además de los métodos heredados, expone operaciones específicas para
 * la gestión de usuarios como validación de email, recuperación de contraseñas
 * y búsqueda por matrícula.
 */
export interface UserRepository
  extends Repository<number, User, NewUser, UserUpdate, UserCriteria> {
  /**
   * Verifica si un email ya está registrado en el sistema.
   *
   * @param email - Dirección de correo electrónico a validar.
   * @returns Una promesa que resuelve a `true` si el email ya existe,
   *          o `false` si no está registrado.
   */
  emailIsRegistered(email: string): Promise<boolean>;

  /**
   * Obtiene el hash de la contraseña asociado a un email.
   *
   * @param email - Dirección de correo electrónico del usuario.
   * @returns Una promesa que resuelve con un {@link Result}:
   * - `Ok<string>` → Contiene el hash de la contraseña si se encuentra.
   * - `Err<void>` → Indica que no existe un usuario con ese email.
   */
  getPasswordHash(email: string): Promise<Result<string, void>>;

  /**
   * Busca un usuario a partir de su matrícula (tuition).
   *
   * @param tuition - Matrícula única del usuario a buscar.
   * @returns Una promesa que resuelve con el objeto {@link User} si existe,
   *          o `undefined` si no se encuentra ningún usuario con esa matrícula.
   */
  findByTuition(tuition: string): Promise<User | undefined>;
}
