import { Err, Ok, Result } from "persistence/common/valueObjects";
import { UseCaseAsync } from "business/common/useCases";
import { FieldError } from "persistence/common/entities";
import { NewUser, User } from "persistence/users/entities";
import { BusinessValidator } from "business/common/validators";
import { Hasher } from "business/auth/services";
import { UserRepository } from "persistence/users/repositories/user.repository";

/**
 * Entrada para el caso de uso `addUserUseCase`.
 *
 * @property input - Datos del nuevo usuario que se desea registrar.
 * @property repository - Repositorio de usuarios encargado de la persistencia.
 * @property hasher - Servicio encargado de hashear contraseñas.
 * @property validator - Validador de negocio para la entidad `NewUser`.
 */
type AddUseInput = {
  input: NewUser;
  repository: UserRepository;
  hasher: Hasher;
  validator: BusinessValidator<NewUser>;
};

/**
 * Salida del caso de uso `addUserUseCase`.
 *
 * Representa un `Result`:
 * - `Ok<User>` si la creación fue exitosa.
 * - `Err<FieldError[]>` si ocurrieron errores de validación o de negocio.
 */
type AddUseOutput = Result<User, FieldError[]>;

/**
 * Caso de uso: Agregar un nuevo usuario al sistema.
 *
 * Este caso de uso encapsula la lógica de negocio para registrar usuarios:
 * 1. Valida los datos de entrada usando el `BusinessValidator`.
 * 2. Verifica si el correo ya está registrado en el repositorio.
 * 3. Hashea la contraseña usando el servicio `Hasher`.
 * 4. Persiste el nuevo usuario en el `UserRepository`.
 *
 * ---
 * ### Argumentos
 * @param input - Datos del nuevo usuario (`NewUser`).
 * @param repository - Implementación de `UserRepository`.
 * @param hasher - Servicio que implementa la interfaz `Hasher` y se encarga de convertir contraseñas en hashes seguros.
 * @param validator - Implementación de `BusinessValidator<NewUser>` que valida las reglas de negocio sobre la entidad antes de persistirla.
 *
 * ### Retorno
 * Retorna una promesa que resuelve en un `Result<User, FieldError[]>`:
 * - `Ok<User>` → Contiene el usuario creado y persistido exitosamente.
 * - `Err<FieldError[]>` → Contiene una lista de errores de validación.
 */
export const addUserUseCase: UseCaseAsync<AddUseInput, AddUseOutput> = {
  async execute({ input, repository, hasher, validator }) {
    const potentialRecord: NewUser = {
      ...input,
      tuition: input.tuition.toUpperCase(),
      firstName: input.firstName.toUpperCase(),
      midName: input.midName?.toUpperCase(),
      fatherLastname: input.fatherLastname.toUpperCase(),
      motherLastname: input.motherLastname?.toUpperCase(),
    };

    const validation = validator.validate(potentialRecord);

    if (!validation.success) return Err(validation.error);

    const errors: FieldError[] = [];

    const [emailRegistered, repeatedTuition] = await Promise.all([
      repository.emailIsRegistered(potentialRecord.email),
      repository.findByTuition(potentialRecord.tuition),
    ]);

    if (emailRegistered)
      errors.push({
        field: "email",
        message: "Email ya registrado",
      });

    if (repeatedTuition)
      errors.push({
        field: "tuition",
        message: "La matrícula ya está registrada",
      });

    if (errors.length !== 0) {
      return Err(errors);
    }

    const hashedPwd = hasher.hash(potentialRecord.password);

    const record = await repository.add({
      ...potentialRecord,
      password: hashedPwd,
    });

    return Ok(record);
  },
};
