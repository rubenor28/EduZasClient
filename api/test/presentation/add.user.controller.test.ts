import express from "express";
import request from "supertest";
import { Gender } from "persistence/users/enums";
import { bcryptHasher } from "business/common/services/hasher";
import { NewUser, PublicUser } from "persistence/users/entities";
import { createUserExpressController } from "presentation/controllers";
import { inMemoryUserRepository } from "../persistence/users/repositories/user.testing.repository";
import {
  newUserBusinessZodValidator,
  newUserTypeZodValidator,
} from "business/users/validators/zod";

describe("Test endpoint usuarios: Creacion de usuarios", () => {
  const endpoint = "users";
  const repository = inMemoryUserRepository;

  const testNew: NewUser = {
    email: "aaaabbbbccceee@gmail.com",
    tuition: "RSRO220228",
    firstName: "Ruben".toUpperCase(),
    midName: undefined,
    fatherLastname: "Roman".toUpperCase(),
    motherLastname: undefined,
    password: "1234Ab!@",
    gender: Gender.MALE,
  };

  const testCreated: PublicUser = {
    id: 1,
    email: testNew.email,
    tuition: testNew.tuition,
    firstName: testNew.firstName,
    fatherLastname: testNew.fatherLastname,
    gender: testNew.gender,
  };

  const app = express();
  app.use(express.json());
  app.use(
    "/users",
    createUserExpressController({
      repository,
      hasher: bcryptHasher,
      newUserBusinessValidator: newUserBusinessZodValidator,
      newUserTypeValidator: newUserTypeZodValidator,
    }),
  );

  // Limpia registros y reinicia identidades antes de cada test
  beforeEach(async () => {
    repository.dropData();
  });

  test("Inserción exitosa", async () => {
    const res = await request(app).post(`/${endpoint}`).send(testNew);

    expect(res.status).toBe(201);

    // valida igualdad estructural, no identidad
    expect(res.body.record).toEqual(testCreated);
  });

  test("Insercion email repetido", async () => {
    const firstRecord = {
      ...testNew,
      email: "rsro220228@upemor.edu.mx",
      tuition: "rsro220228",
    };

    const invalidRecord = {
      ...testNew,
      email: "rsro220228@upemor.edu.mx",
      tuition: "rsro220229",
    };

    const firstInsert = await request(app)
      .post(`/${endpoint}`)
      .send(firstRecord);

    expect(firstInsert.status).toBe(201);

    const addition = await request(app)
      .post(`/${endpoint}`)
      .send(invalidRecord);

    expect(addition.ok).toBe(false);
  });

  test("Formato matricula invalida", async () => {
    const invalidRecord = {
      ...testNew,
      email: "rsro220228@upemor.edu.mx",
      tuition: "123sadjalkasds",
    };

    const addition = await request(app)
      .post(`/${endpoint}`)
      .send(invalidRecord);

    expect(addition.ok).toBe(false);
  });

  test("Insercion matricula repetida", async () => {
    const firstRecord = {
      ...testNew,
      email: "rsro220228@upemor.edu.mx",
      tuition: "rsro220228",
    };

    const invalidRecord = {
      ...testNew,
      email: "rsro220229@upemor.edu.mx",
      tuition: "rsro220228",
    };

    const firstInsert = await request(app)
      .post(`/${endpoint}`)
      .send(firstRecord);

    expect(firstInsert.status).toBe(201);

    const addition = await request(app)
      .post(`/${endpoint}`)
      .send(invalidRecord);

    expect(addition.ok).toBe(false);
  });

  test("Insercion contraseña invalida", async () => {
    const invalidRecord = {
      ...testNew,
      password: "123",
    };

    const addition = await request(app)
      .post(`/${endpoint}`)
      .send(invalidRecord);

    expect(addition.ok).toBe(false);
  });

  test("Insercion nombre compuesto", async () => {
    const input: NewUser = {
      ...testNew,
      firstName: "MaRíA",
      midName: "DeL CaRmEl",
      fatherLastname: "Pérez",
      motherLastname: "DEl leon",
    };

    const addition = await request(app).post(`/${endpoint}`).send(input);

    expect(addition.ok).toBe(true);
  });

  test("Insercion nombre invalido", async () => {
    const invalidRecords: NewUser[] = [
      { ...testNew, firstName: "Ruben Omar" },
      { ...testNew, midName: "Ruben Omar" },
      { ...testNew, fatherLastname: "Ruben Omar" },
      { ...testNew, motherLastname: "Ruben Omar" },
    ];

    for (let i = 0; i < invalidRecords.length; i++) {
      const invalidRecord = {
        ...invalidRecords[i],
        tuition: `rsro22${i.toString().padStart(4, "0")}`,
        email: `${i.toString().padStart(4, "0")}@test.com`,
      } as NewUser;

      const addition = await request(app)
        .post(`/${endpoint}`)
        .send(invalidRecord);

      if (addition.ok) {
        throw Error(
          `❌ Inserción incorrecta para: ${JSON.stringify(invalidRecord)}`,
        );
      }
    }
  });
});
