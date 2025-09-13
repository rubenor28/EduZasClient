import { Router } from "express";

import { ObjectTypeValidator } from "business/common/validators";
import type { UserRepository } from "persistence/users/repositories";
import { PublicUser, UserCredentials } from "persistence/users/entities";

import { logInUseCase, isLoginUseCase } from "business/auth/useCase";
import { userToPublicUser } from "persistence/users/mappers";
import { userPrismaRepository } from "persistence/users/repositories";
import { userCredentialsZodValidator } from "business/auth/validators";

import {
  bcryptHasher,
  Hasher,
  jwtService,
  SignedTokenErrors,
  SignedTokenExpirationTime,
  SignedTokenService,
} from "business/auth/services";
import { publicUserTypeZodValidator } from "business/users/validators/zod/public.user.type.zod.validator";

/**
 * Mapeo de tiempos de expiración de los tokens a milisegundos.
 *
 * Usado para configurar la cookie de sesión JWT.
 */
const mapCookieExpirationTime = {
  [SignedTokenExpirationTime.Minutes15]: 15 * 60 * 1000, // 15 minutos
  [SignedTokenExpirationTime.Minutes30]: 30 * 60 * 1000, // 30 minutos
  [SignedTokenExpirationTime.Hours1]: 60 * 60 * 1000, // 1 hora
  [SignedTokenExpirationTime.Hours24]: 24 * 60 * 60 * 1000, // 24 horas
};

/**
 * Crea un controlador de autenticación para Express.
 *
 * @param opts - Dependencias necesarias para configurar el controlador.
 * @param opts.repository - Repositorio de usuarios para acceder a datos de persistencia.
 * @param opts.hasher - Servicio para hashear credenciales (ej. `bcrypt`).
 * @param opts.tokenService - Servicio para firmar y validar tokens JWT.
 * @param opts.userCredentialsValidator - Validador de las credenciales de entrada.
 *
 * @returns Un {@link Router} de Express listo para montar en la aplicación.
 */
export function createAuthExpressController(opts: {
  hasher: Hasher;
  repository: UserRepository;
  tokenService: SignedTokenService;
  credentialsValidator: ObjectTypeValidator<UserCredentials>;
  publicUserValidator: ObjectTypeValidator<PublicUser>;
}) {
  const {
    repository,
    hasher,
    tokenService,
    credentialsValidator,
    publicUserValidator,
  } = opts;
  const expiresIn = SignedTokenExpirationTime.Hours24;
  const router = Router();

  const { httpOnly, secure, sameSite } = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
  };

  /**
   * POST `/`
   *
   * Autentica al usuario con sus credenciales, genera un JWT y lo guarda
   * en una cookie con las banderas `HttpOnly`, `Secure` y `SameSite`.
   */
  router.post("/", async (req, res) => {
    try {
      const validation = credentialsValidator.validate(req.body);

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
          httpOnly,
          secure,
          sameSite,
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

  /**
   * GET `/`
   *
   * Verifica si la sesión actual está autenticada validando la cookie `jwt`
   * y devuelve el usuario almacenado en el payload del token.
   */
  router.get("/", (req, res) => {
    try {
      const token = req.cookies?.jwt;
      if (!token) return res.status(401).json({ message: "Unauthenticated" });

      const validation = isLoginUseCase.execute({
        tokenService,
        token,
        publicUserValidator,
      });

      if (validation.err) {
        if (validation.val === SignedTokenErrors.Unknown)
          throw new Error("Unknown token error");

        return res.status(401).json({ message: validation.val });
      }

      return res.status(200).json({ user: validation.val });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  /**
   * DELETE `/logout`
   *
   * Cierra la sesión eliminando la cookie de autenticación.
   */
  router.delete("/", (_req, res) => {
    res
      .clearCookie("jwt", { httpOnly, sameSite, secure })
      .status(200)
      .json({ message: "Logged out" });
  });

  return router;
}

/**
 * Controlador de autenticación predeterminado con implementaciones concretas:
 * - `userPrismaRepository` para persistencia.
 * - `bcryptHasher` para verificación de credenciales.
 * - `jwtService` para manejo de tokens.
 * - `userCredentialsZodValidator` para validación de credenciales.
 */
export const authExpressController = createAuthExpressController({
  repository: userPrismaRepository,
  hasher: bcryptHasher,
  tokenService: jwtService,
  credentialsValidator: userCredentialsZodValidator,
  publicUserValidator: publicUserTypeZodValidator,
});
