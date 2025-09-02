import { Hasher } from "../services";
import { JWT_SECRET } from "config";
import { Err, Ok, Result } from "ts-results";
import { UseCaseAsync } from "business/common/useCases";
import { FieldError } from "persistence/common/entities";
import { StringSearchType } from "persistence/common/enums";
import { UserRepository } from "persistence/users/repositories";
import { userToPublicUser } from "persistence/users/mappers";
import { UserCredentials } from "persistence/users/entities";
import {
  SignedTokenExpirationTime,
  SignedTokenService,
} from "../services/";

/**
 * Tipo de entrada para el caso de uso de inicio de sesión.
 * Define las dependencias y datos requeridos para ejecutar el login.
 *
 * @property input - Credenciales de autenticación
 * @property input.email - Correo electrónico del usuario
 * @property input.password - Contraseña del usuario
 * @property repository - Repositorio de usuarios para acceso a datos
 * @property tokenService - Servicio para generación de tokens JWT
 * @property hasher - Servicio de hashing para verificación de contraseñas
 */
type LogInInput = {
  input: UserCredentials;
  repository: UserRepository;
  tokenService: SignedTokenService;
  hasher: Hasher;
};

/**
 * Tipo de salida para el caso de uso de inicio de sesión.
 * Utiliza el patrón Result de ts-results para manejo funcional de errores.
 *
 * @success - Token JWT generado (string)
 * @error - Error de campo con detalles de validación (FieldError)
 */
type LogInOutput = Result<string, FieldError>;

/**
 * Caso de uso para el proceso de autenticación de usuarios.
 *
 * @remarks
 * Este caso de uso implementa el flujo completo de autenticación:
 * 1. Verifica la existencia del email
 * 2. Recupera el usuario desde el repositorio
 * 3. Valida las credenciales (contraseña)
 * 4. Genera un token JWT con los datos públicos del usuario
 *
 * @example
 * ```typescript
 * // Ejemplo de uso
 * const result = await logInUseCase.execute({
 *   input: { email: "usuario@ejemplo.com", password: "contraseña123" },
 *   repository: userRepository,
 *   tokenService: jwtTokenService,
 *   hasher: bcryptHasher
 * });
 *
 * if (result.ok) {
 *   // Autenticación exitosa, usar result.val (token JWT)
 *   const token = result.val;
 * } else {
 *   // Error de autenticación, usar result.val (FieldError)
 *   console.error(`Error en ${result.val.field}: ${result.val.message}`);
 * }
 * ```
 */
export const logInUseCase: UseCaseAsync<LogInInput, LogInOutput> = {
  /**
   * Ejecuta el flujo de autenticación de usuario
   *
   * @param params - Parámetros de entrada con dependencias y credenciales
   * @returns Promise con Result que contiene token JWT o error de validación
   *
   * @throws Error - Solo en casos excepcionales donde la lógica de negocio falla
   * (usuario existe según emailIsRegistered pero no se encuentra en getBy)
   */
  async execute({ input, repository, tokenService, hasher }) {
    const { email, password } = input;

    const emailExists = await repository.emailIsRegistered(email);

    if (!emailExists)
      return Err({ field: "email", message: "Email no encontrado" });

    const userSearch = await repository.getBy({
      page: 1,
      email: {
        searchType: StringSearchType.EQ,
        string: email,
      },
    });

    const user = userSearch.results[0];

    if (user === undefined)
      throw new Error(
        "User record should exists based on emailIsRegistered check",
      );

    if (!hasher.matches(password, user.password))
      return Err({ field: "password", message: "Contraseña incorrecta" });

    return Ok(
      tokenService.generate(
        JWT_SECRET,
        SignedTokenExpirationTime.Hours24,
        userToPublicUser(user),
      ),
    );
  },
};
