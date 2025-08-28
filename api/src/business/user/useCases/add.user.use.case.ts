import { Hasher } from "business/common/services/hasher/hasher";
import { UseCase } from "business/common/useCases";
import { NewUser, User } from "persistence/users/entities";
import { UserRepository } from "persistence/users/repositories/user.repository";
import { BusinessValidator } from "business/common/validators";

type AddUseInput = {
  input: NewUser;
  repository: UserRepository;
  hasher: Hasher;
  validator: BusinessValidator<NewUser>;
};

type AddUseOutput = Promise<User>;

export const addUserUseCase: UseCase<AddUseInput, AddUseOutput> = {
  execute({ input, repository, hasher, validator }) {
    const isValid = validator.isValid(input);

    if (!isValid) return;
  },
};
