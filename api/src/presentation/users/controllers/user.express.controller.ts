// presentation/controllers/user.controller.ts
import { Router } from "express";
import type { Hasher } from "business/auth/services";
import type { UserRepository } from "persistence/users/repositories";
import { addUserUseCase } from "business/users/useCases";
import { userToPublicUser } from "persistence/users/mappers";
import {
  BusinessValidator,
  ObjectTypeValidator,
} from "business/common/validators";
import { NewUser, User } from "persistence/users/entities";

export function createUserExpressController(opts: {
  repository: UserRepository;
  hasher: Hasher;
  newUserTypeValidator: ObjectTypeValidator<NewUser>;
  newUserBusinessValidator: BusinessValidator<User>;
}) {
  const { repository, hasher, newUserTypeValidator, newUserBusinessValidator } =
    opts;
  const router = Router();

  router.post("/", async (req, res) => {
    try {
      const validation = newUserTypeValidator.validate(req.body);

      if (!validation.success) {
        return res
          .status(400)
          .json({ message: "Error", error: validation.error });
      }

      const result = await addUserUseCase.execute({
        repository,
        hasher,
        validator: newUserBusinessValidator,
        input: validation.value,
      });

      if (!result.ok) {
        return res.status(400).json({ message: "Error", error: result.val });
      }

      return res
        .status(201)
        .json({ message: "Created", record: userToPublicUser(result.val) });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  return router;
}

import { userPrismaRepository } from "persistence/users/repositories";
import { bcryptHasher } from "business/auth/services";
import { newUserTypeZodValidator } from "business/users/validators/zod";
import { newUserBusinessZodValidator } from "business/users/validators/zod";

export const userExpressController = createUserExpressController({
  repository: userPrismaRepository,
  hasher: bcryptHasher,
  newUserTypeValidator: newUserTypeZodValidator,
  newUserBusinessValidator: newUserBusinessZodValidator,
});
