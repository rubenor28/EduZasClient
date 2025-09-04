import { Router } from "express";
import type { UserRepository } from "persistence/users/repositories";
import { logInUseCase } from "business/auth/useCase/log.in.use.case";
import { ObjectTypeValidator } from "business/common/validators";
import { UserCredentials } from "persistence/users/entities";
import { userPrismaRepository } from "persistence/users/repositories";
import { userCredentialsZodValidator } from "business/auth/validators/user.credentials.zod.validator";
import {
  bcryptHasher,
  Hasher,
  jwtService,
  SignedTokenExpirationTime,
  SignedTokenService,
} from "business/auth/services";
import { userToPublicUser } from "persistence/users/mappers";

const mapCookieExpirationTime = {
  [SignedTokenExpirationTime.Minutes15]: 15 * 60 * 1000, // 15 minutos en ms
  [SignedTokenExpirationTime.Minutes30]: 30 * 60 * 1000, // 30 minutos en ms
  [SignedTokenExpirationTime.Hours1]: 60 * 60 * 1000, // 1 hora en ms
  [SignedTokenExpirationTime.Hours24]: 24 * 60 * 60 * 1000, // 24 horas en ms
};

export function createAuthExpressController(opts: {
  repository: UserRepository;
  hasher: Hasher;
  tokenService: SignedTokenService;
  userCredentialsValidator: ObjectTypeValidator<UserCredentials>;
}) {
  const { repository, hasher, tokenService, userCredentialsValidator } = opts;
  const router = Router();
  const expiresIn = SignedTokenExpirationTime.Hours24;

  router.post("/", async (req, res) => {
    try {
      const validation = userCredentialsValidator.validate(req.body);

      if (!validation.success) {
        return res
          .status(400)
          .json({ message: "Error", error: validation.error });
      }

      const result = await logInUseCase.execute({
        repository,
        hasher,
        tokenService,
        expiresIn,
        input: validation.value,
      });

      if (!result.ok) {
        return res.status(400).json({ message: "Error", error: [result.val] });
      }

      return res
        .status(200)
        .cookie("jwt", result.val.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: mapCookieExpirationTime[expiresIn],
        })
        .json({
          message: "Autenticado",
          user: userToPublicUser(result.val.user),
        });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  return router;
}

export const authExpressController = createAuthExpressController({
  repository: userPrismaRepository,
  hasher: bcryptHasher,
  tokenService: jwtService,
  userCredentialsValidator: userCredentialsZodValidator,
});
