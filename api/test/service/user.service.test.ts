import { makeUserZodValidator } from "../../src/service/user.zod.service";
import { createCrudService } from "../../src/service/service";
import { prismaUserRepository } from "../../src/repository";
import { prisma } from "../../src/config";
import { NewUserDTO, User } from "../../src/model";
import { password } from "bun";

describe("Operaciones CRUD userRepository", () => {
  const repo = prismaUserRepository;
  const validator = makeUserZodValidator(repo);
  const service = createCrudService({ repo, validator });

  const testNew: NewUserDTO = {
    email: "aaaabbbbccceee@gmail.com",
    tuition: "RSRO220228",
    firstName: "Ruben",
    midName: undefined,
    fatherLastname: "Roman",
    motherLastname: undefined,
    password: "1234Ab!@",
    gender: "Masculino",
  };

  const testCreated: User = {
    ...testNew,
    id: 1,
    active: true,
    createdAt: expect.any(Date),
    modifiedAt: expect.any(Date),
  };

  // Limpia y conecta antes de todos los tests
  beforeAll(async () => {
    await prisma.$connect();
  });

  // Limpia registros y reinicia identidades antes de cada test
  beforeEach(async () => {
    await prisma.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS = 0;");

    // Obtener todas las tablas
    const tables = await prisma.$queryRawUnsafe<{ TABLE_NAME: string }[]>(
      `SELECT TABLE_NAME 
     FROM information_schema.TABLES 
     WHERE TABLE_SCHEMA = DATABASE()`,
    );

    // Truncar cada tabla (elimina datos + reinicia autoincrementos)
    for (const table of tables) {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${table.TABLE_NAME}`);
    }

    // Rehabilitar verificaciones de FK
    await prisma.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS = 1;");
  });

  test("Insercion exitosa", async () => {
    const validation = await validator.validateNew(testNew, repo);
    expect(validation.ok).toBe(true);

    const addition = await service.add(testNew);
    expect(addition.ok).toBe(true);
    expect(addition.unwrap()).toEqual(testCreated);
  });

  test("Insercion email repetido", async () => {
    const firstInsert = await service.add({
      ...testNew,
      email: "rsro220228@upemor.edu.mx",
      tuition: "rsro220228",
    });
    expect(firstInsert.ok).toBe(true);

    const invalidRecord = {
      ...testNew,
      email: "rsro220228@upemor.edu.mx",
      tuition: "rsro220229",
    };

    const validation = await validator.validateNew(invalidRecord, repo);
    expect(validation.err).toBe(true);

    const insercion = await service.add(invalidRecord);
    expect(insercion.err).toBe(true);
  });

  test("Formato matricula invalida", async () => {
    const invalidRecord = {
      ...testNew,
      email: "rsro220228@upemor.edu.mx",
      tuition: "123sadjalkasds",
    };

    const validation = await validator.validateNew(invalidRecord, repo);
    expect(validation.err).toBe(true);

    const insercion = await service.add(invalidRecord);
    expect(insercion.err).toBe(true);
  });

  test("Insercion matricula repetida", async () => {
    const firstInsert = await service.add({
      ...testNew,
      email: "rsro220228@upemor.edu.mx",
      tuition: "rsro220228",
    });
    expect(firstInsert.ok).toBe(true);

    const invalidRecord = {
      ...testNew,
      email: "rsro220229@upemor.edu.mx",
      tuition: "rsro220228",
    };

    const validation = await validator.validateNew(invalidRecord, repo);
    expect(validation.err).toBe(true);

    const insercion = await service.add(invalidRecord);
    expect(insercion.err).toBe(true);
  });

  test("Insercion contraeña invalida", async () => {
    const invalidRecord = {
      ...testNew,
      password: "123",
    };

    const validation = await validator.validateNew(invalidRecord, repo);
    expect(validation.err).toBe(true);

    const insercion = await service.add(invalidRecord);
    expect(insercion.err).toBe(true);
  });
});
