import express from "express";
import request from "supertest";

import { Gender } from "persistence/users/enums";
import { NewUser } from "persistence/users/entities";
import { inMemoryUserRepository } from "../persistence/users/repositories/user.testing.repository";
import { createAuthExpressController } from "presentation/auth/controllers";
import { bcryptHasher, jwtService } from "business/auth/services";
import { userCredentialsZodValidator } from "business/auth/validators";
import { addUserUseCase } from "business/users/useCases";
import { newUserBusinessZodValidator } from "business/users/validators/zod";
import { publicUserTypeZodValidator } from "business/users/validators/zod/public.user.type.zod.validator";

describe("Test controlador autenticacion", () => {
  const endpoint = "auth";
  const hasher = bcryptHasher;
  const tokenService = jwtService;
  const repository = inMemoryUserRepository;
  const credentialsValidator = userCredentialsZodValidator;
  const publicUserValidator = publicUserTypeZodValidator;

  const credentialsTest = {
    email: "aaaabbbbccceee@gmail.com",
    password: "1234Ab!@",
  };

  const testNew: NewUser = {
    ...credentialsTest,
    tuition: "RSRO220228",
    firstName: "Ruben".toUpperCase(),
    midName: undefined,
    fatherLastname: "Roman".toUpperCase(),
    motherLastname: undefined,
    gender: Gender.MALE,
  };

  const app = express();
  app.use(express.json());
  app.use(
    endpoint,
    createAuthExpressController({
      credentialsValidator,
      publicUserValidator,
      tokenService,
      repository,
      hasher,
    }),
  );

  beforeAll(async () => {
    await addUserUseCase.execute({
      repository,
      validator: newUserBusinessZodValidator,
      hasher,
      input: testNew,
    });
  });

  test("Login exitoso", async () => {
    const res = await request(app).post(`/${endpoint}`).send(credentialsTest);

    if (res.ok === false) console.error(res.body);
    expect(res.ok).toBe(true);
  });

  test("Login erroneo", async () => {
    const res = await request(app)
      .post(`/${endpoint}`)
      .send({ email: "test@gmail.com", password: "1234" });

    if (res.ok === true) console.error(res.body);
    expect(res.ok).toBe(false);
  });

  test("Cerrar sesión", async () => {
    const res = await request(app).delete(`/${endpoint}`);

    if (res.ok === false) console.error(res.body);
    expect(res.ok).toBe(true);
  });

  test("Está autenticado erroneo", async () => {
    const res = await request(app).get(`/${endpoint}`);

    if (res.ok === true) console.error(res.body);
    expect(res.ok).toBe(false);
  });

  test("Está autenticado exitoso", async () => {
    await request(app).post(`/${endpoint}`).send(credentialsTest);

    const res = await request(app).get(`/${endpoint}`);

    if (res.ok) console.error(res.body);
    expect(res.ok).toBe(true);
  });
});
