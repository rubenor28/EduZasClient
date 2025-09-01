import axios from "axios";
import { VITE_API_URL } from "config";
import type { FieldError } from "entities/common/entities";
import type { NewUser, User } from "entities/users/entities";
import { Err, Ok, type Result } from "ts-results";

const userEndpoint = `${VITE_API_URL}/users`;

/**
 * Servicio de usuario que encapsula llamadas HTTP relacionadas con usuarios.
 *
 * @remarks
 * Este objeto proporciona métodos para interactuar con la API de usuarios.
 * Actualmente implementa la creación de nuevos usuarios mediante POST al endpoint
 * `${VITE_API_URL}/users`.
 */
export const userService = {
  /**
   * Crea un nuevo usuario en la API.
   *
   * @param newUser - Objeto {@link NewUser} con los datos del usuario a crear.
   * @returns Una promesa que resuelve un {@link Result} de `User` o un array
   * de {@link FieldError} si ocurre un error de validación.
   *
   * @throws `Error` si la respuesta del servidor es 500 o superior.
   *
   * @example
   * ```ts
   * import { userService } from "./user.service";
   *
   * const newUser = {
   *   tuition: "123456",
   *   firstName: "Juan",
   *   fatherLastname: "Pérez",
   *   email: "juan@example.com",
   *   password: "123456",
   * };
   *
   * const result = await userService.createUser(newUser);
   * if (result.ok) {
   *   console.log("Usuario creado:", result.val);
   * } else {
   *   console.error("Errores de validación:", result.val);
   * }
   * ```
   */
  async createUser(newUser: NewUser): Promise<Result<User, FieldError[]>> {
    const response = await axios.post(userEndpoint, newUser, {
      validateStatus: (status) => status <= 500,
    });

    if (response.status >= 400) {
      return Err(response.data.error as FieldError[]);
    }

    return Ok(response.data.record as User);
  },
};
