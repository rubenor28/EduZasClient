import { Class, NewClass, PublicNewClass } from "persistence/class/entities";
import { Err, Ok, Result } from "persistence/common/valueObjects";
import { FieldError } from "persistence/common/entities";
import { UseCaseAsync } from "business/common/useCases";
import { ClassRepository } from "persistence/class/repositories";
import { BusinessValidator } from "business/common/validators";
import { OpaqueTokenGenerator } from "business/common/services/tokens/opaque.token.generator";
import { UserRepository } from "persistence/users/repositories";

type AddClassInput = {
  classIdGenerator: OpaqueTokenGenerator;
  userRepository: UserRepository;
  repository: ClassRepository;
  validator: BusinessValidator<PublicNewClass>;
  input: PublicNewClass;
};

type AddClassOutput = Result<Class, FieldError[]>;

export const addClassUseCase: UseCaseAsync<AddClassInput, AddClassOutput> = {
  async execute({
    classIdGenerator,
    userRepository,
    repository,
    validator,
    input,
  }) {
    const validation = validator.validate(input);

    if (!validation.success) return Err(validation.error);

    const potentialRecord: NewClass = {
      ...input,
      id: classIdGenerator.generateToken(),
    };

    const user = await userRepository.get(input.ownerId);
    if (user === undefined)
      return Err([{ field: "ownerId", message: "Usuario no encontrado" }]);

    const record = await repository.add(potentialRecord);
    return Ok(record);
  },
};
