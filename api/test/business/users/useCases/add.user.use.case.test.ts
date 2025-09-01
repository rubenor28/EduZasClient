import { NewUser } from "persistence/users/entities";
import { Gender } from "persistence/users/enums";

import { bcryptHasher } from "business/common/services/hasher";
import { addUserUseCase } from "business/users/useCases";
import { newUserBusinessZodValidator } from "business/users/validators/zod/new.user.business.zod.validator";
import { inMemoryUserRepository } from "../../../persistence/users/repositories/user.testing.repository";

describe("Test caso de uso: Creacion de usuarios", () => {
  const repository = inMemoryUserRepository;
  const newUserBusinessValidator = newUserBusinessZodValidator;
  const hasher = bcryptHasher;

  const testNew: NewUser = {
    email: "aaaabbbbccceee@gmail.com",
    tuition: "RSRO220228",
    firstName: "Ruben",
    midName: undefined,
    fatherLastname: "Roman",
    motherLastname: undefined,
    password: "1234Ab!@",
    gender: Gender.MALE,
  };

  // Limpia registros y reinicia identidades antes de cada test
  beforeEach(async () => {
    repository.dropData();
  });

  test("Insercion exitosa", async () => {
    const addition = await addUserUseCase.execute({
      repository,
      hasher,
      validator: newUserBusinessValidator,
      input: testNew,
    });

    expect(addition.ok).toBe(true);
    expect(hasher.matches(testNew.password, addition.unwrap().password)).toBe(
      true,
    );
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

    const firstInsert = await addUserUseCase.execute({
      repository,
      hasher,
      validator: newUserBusinessValidator,
      input: firstRecord,
    });

    expect(firstInsert.ok).toBe(true);

    const addition = await addUserUseCase.execute({
      repository,
      hasher,
      validator: newUserBusinessValidator,
      input: invalidRecord,
    });
    expect(addition.err).toBe(true);
  });

  test("Formato matricula invalida", async () => {
    const invalidRecord = {
      ...testNew,
      email: "rsro220228@upemor.edu.mx",
      tuition: "123sadjalkasds",
    };

    const addition = await addUserUseCase.execute({
      repository,
      hasher,
      validator: newUserBusinessValidator,
      input: invalidRecord,
    });

    expect(addition.err).toBe(true);
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

    const firstInsert = await addUserUseCase.execute({
      repository,
      hasher,
      validator: newUserBusinessValidator,
      input: firstRecord,
    });

    expect(firstInsert.ok).toBe(true);

    const addition = await addUserUseCase.execute({
      repository,
      hasher,
      validator: newUserBusinessValidator,
      input: invalidRecord,
    });

    expect(addition.err).toBe(true);
  });

  test("Insercion contraseña invalida", async () => {
    const invalidRecord = {
      ...testNew,
      password: "123",
    };

    const addition = await addUserUseCase.execute({
      repository,
      hasher,
      validator: newUserBusinessValidator,
      input: invalidRecord,
    });

    expect(addition.err).toBe(true);
  });

  test("Insercion nombre compuesto", async () => {
    const input: NewUser = {
      ...testNew,
      firstName: "MaRíA",
      midName: "DeL CaRmEl",
      fatherLastname: "Pérez",
      motherLastname: "DEl leon",
    };

    const addition = await addUserUseCase.execute({
      repository,
      hasher,
      validator: newUserBusinessValidator,
      input,
    });

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

      const addition = await addUserUseCase.execute({
        repository,
        hasher,
        validator: newUserBusinessValidator,
        input: invalidRecord,
      });

      if (addition.ok) {
        throw Error(
          `❌ Inserción incorrecta para: ${JSON.stringify(invalidRecord)}`,
        );
      }
    }
  });
});
