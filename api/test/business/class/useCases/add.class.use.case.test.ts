import { PublicNewClass } from "persistence/class/entities";
import { beforeAll, beforeEach, describe, test, expect } from "bun:test";

import { addClassUseCase } from "business/class/useCases";
import { createTokenGenerator } from "business/common/services/tokens";
import { publicNewClassBusinessValidator } from "business/class/validators";

import { inMemoryClassRepository } from "../../../persistence/class/repositories/class.testing.repository";
import { inMemoryUserRepository } from "../../../persistence/users/repositories/user.testing.repository";

describe("Test caso de uso: Creación de clases", () => {
  const allowedChars = "abcdefghijklmnñopqrstuvwxyz";
  const classIdGenerator = createTokenGenerator(allowedChars, 20);
  const userRepository = inMemoryUserRepository;
  const repository = inMemoryClassRepository;
  const validator = publicNewClassBusinessValidator;

  const testNew: PublicNewClass = {
    ownerId: 1,
    className: "Class test",
    section: "test",
    subject: "test",
  };

  beforeAll(async () => {
    await userRepository.add({
      tuition: "1",
      email: "2",
      fatherLastname: "3",
      firstName: "4",
      password: "5",
    });
  });

  beforeEach(() => {
    repository.dropData();
  });

  test("Insercion valida", async () => {
    const validation = await addClassUseCase.execute({
      classIdGenerator,
      userRepository,
      repository,
      validator,
      input: testNew,
    });

    expect(validation.ok).toBe(true);
  });

  test("Usuario invalido", async () => {
    const validation = await addClassUseCase.execute({
      classIdGenerator,
      userRepository,
      repository,
      validator,
      input: { ...testNew, ownerId: 100 },
    });

    expect(validation.err).toBe(true);
  });

  test("Campos invalidos", async () => {
    const invalidRecords: PublicNewClass[] = [
      { ...testNew, className: "" },
      { ...testNew, subject: "" },
      { ...testNew, section: "" },
    ];

    for (const invalidRecord of invalidRecords) {
      const addition = await addClassUseCase.execute({
        classIdGenerator,
        userRepository,
        repository,
        validator,
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
