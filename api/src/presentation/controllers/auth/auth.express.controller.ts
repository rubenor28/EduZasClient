import { Router } from "express";
import type { Hasher, SignedTokenService } from "business/auth/services";
import type { UserRepository } from "persistence/users/repositories";
import { logInUseCase } from "business/auth/useCase/log.in.use.case";
import { ObjectTypeValidator } from "business/common/validators";
import { UserCredentials } from "persistence/users/entities";

export function createAuthExpressController(opts: {
  repository: UserRepository;
  hasher: Hasher;
  tokenService: SignedTokenService;
  userCredentialsValidator: ObjectTypeValidator<UserCredentials>;
}) {
  const router = Router();

  router.post("/", (req, res) => {
    try {
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  return router;
}
