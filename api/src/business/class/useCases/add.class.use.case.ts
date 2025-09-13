import { UseCaseAsync } from "business/common/useCases";
import { FieldError } from "persistence/common/entities";
import { BusinessValidator } from "business/common/validators";
import { UserRepository } from "persistence/users/repositories";
import { ClassRepository } from "persistence/class/repositories";
import { Err, Ok, Result } from "persistence/common/valueObjects";
import { Class, NewClass, PublicNewClass } from "persistence/class/entities";
import { OpaqueTokenGenerator } from "business/common/services/tokens/opaque.token.generator";

/**
 * Define los parametros necesarios para el
 * caso de uso de creación de una clase
 */
type AddClassInput = {
  /** Servicio para generar el ID único de la clase. */
  classIdGenerator: OpaqueTokenGenerator;
  /** Repositorio para acceder a los datos del usuario propietario. */
  userRepository: UserRepository;
  /** Repositorio para la persistencia de la nueva clase. */
  repository: ClassRepository;
  /** Validador para asegurar la integridad de los datos de entrada. */
  validator: BusinessValidator<PublicNewClass>;
  /** Los datos públicos proporcionados para crear la clase. */
  input: PublicNewClass;
};

/**
 * Define el tipo de salida del caso de uso `addClassUseCase`.
 *
 * Representa un resultado que puede ser:
 * - `Ok<Class>`: Si la clase se creó exitosamente, contiene la entidad completa.
 * - `Err<FieldError[]>`: Si ocurrió un error, contiene un arreglo de errores de campo.
 */
type AddClassOutput = Result<Class, FieldError[]>;

/**
 * Caso de uso para agregar una nueva clase al sistema.
 *
 * Orquesta el proceso de creación de una clase, incluyendo:
 * 1. Validación de los datos de entrada.
 * 2. Verificación de la existencia del usuario propietario.
 * 3. Generación de un ID único.
 * 4. Persistencia de la nueva clase en el repositorio.
 *
 * @implements {UseCaseAsync<AddClassInput, AddClassOutput>}
 */
export const addClassUseCase: UseCaseAsync<AddClassInput, AddClassOutput> = {
  /**
   * Ejecuta la lógica para crear una clase.
   * @param input - Un objeto que contiene las dependencias y los datos de entrada.
   * @returns Una promesa que se resuelve en un objeto `Result` con la clase creada o los errores.
   */
  async execute({
    classIdGenerator,
    userRepository,
    repository,
    validator,
    input,
  }) {
    const validation = validator.validate(input);
    if (!validation.success) {
      return Err(validation.error);
    }

    const potentialRecord: NewClass = {
      ...input,
      id: classIdGenerator.generateToken(),
    };

    const user = await userRepository.get(input.ownerId);
    if (user === undefined) {
      return Err([{ field: "ownerId", message: "Usuario no encontrado" }]);
    }

    const record = await repository.add(potentialRecord);

    return Ok(record);
  },
};
