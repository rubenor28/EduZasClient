import { logInUseCase } from "business/auth/useCase/log.in.use.case";
import { inMemoryUserRepository } from "../../../persistence/users/repositories/user.testing.repository";
import { NewUser } from "persistence/users/entities";
import { Gender } from "persistence/users/enums";
import {
  bcryptHasher,
  jwtService,
  SignedTokenExpirationTime,
} from "business/auth/services";
import { addUserUseCase } from "business/users/useCases";
import { newUserBusinessZodValidator } from "business/users/validators/zod";

describe("Test caso de uso: Autenticación", () => {
  const expiresIn = SignedTokenExpirationTime.Minutes15;
  const validator = newUserBusinessZodValidator;
  const hasher = bcryptHasher;
  const repository = inMemoryUserRepository;
  const tokenService = jwtService;

  const user: NewUser = {
    email: "aaaabbbbccceee@gmail.com",
    tuition: "RSRO220228",
    firstName: "Ruben",
    midName: undefined,
    fatherLastname: "Roman",
    motherLastname: undefined,
    password: "1234Ab!@",
    gender: Gender.MALE,
  };

  beforeEach(async () => {
    repository.dropData();
  });

  test("Autenticación credenciales correctas", async () => {
    const addition = await addUserUseCase.execute({
      repository,
      hasher,
      validator,
      input: user,
    });

    expect(addition.ok).toBe(true);

    const logIn = await logInUseCase.execute({
      repository,
      tokenService,
      hasher,
      expiresIn,
      input: {
        email: user.email,
        password: user.password,
      },
    });

    expect(logIn.ok).toBe(true);
  });

  test("Autenticación credenciales incorrectas", async () => {
    const addition = await addUserUseCase.execute({
      repository,
      hasher,
      validator,
      input: user,
    });

    expect(addition.ok).toBe(true);

    const logIn = await logInUseCase.execute({
      repository,
      tokenService,
      hasher,
      expiresIn,
      input: {
        email: "test@error.com",
        password: "Absdcfhj1.",
      },
    });

    expect(logIn.err).toBe(true);
  });
});
