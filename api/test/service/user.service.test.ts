import { makeUserZodValidator } from "../../src/service/user.zod.service";
import { CrudService } from "../../src/service/service";
import { prismaUserRepository } from "../../src/repository";
import { prisma } from "../../src/config";
import { Gender, NewUserDTO, User, UserType } from "../../src/model";

describe("Operaciones CRUD y validaciones Servicio Usuario", () => {
  const repo = prismaUserRepository;
  const validator = makeUserZodValidator(repo);
  const service = new CrudService({ repo, validator });

  const testNew: NewUserDTO = {
    email: "aaaabbbbccceee@gmail.com",
    tuition: "RSRO220228",
    firstName: "Ruben",
    midName: undefined,
    fatherLastname: "Roman",
    motherLastname: undefined,
    password: "1234Ab!@",
    gender: Gender.MALE,
  };

  const testCreated: User = {
    ...testNew,
    id: 1,
    role: UserType.STUDENT,
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

  test("Insercion contraseña invalida", async () => {
    const invalidRecord = {
      ...testNew,
      password: "123",
    };

    const validation = await validator.validateNew(invalidRecord, repo);
    expect(validation.err).toBe(true);

    const insercion = await service.add(invalidRecord);
    expect(insercion.err).toBe(true);
  });

  test("Insercion nombre compuesto", async () => {
    const invalidRecord: NewUserDTO = {
      ...testNew,
      firstName: "MaRíA",
      midName: "DeL CaRmEl",
      fatherLastname: "Pérez",
      motherLastname: "DEl leon",
    };

    const validation = await validator.validateNew(invalidRecord, repo);
    expect(validation.ok).toBe(true);

    const insercion = await service.add(invalidRecord);
    expect(insercion.ok).toBe(true);
  });

  test("Insercion nombre invalido", async () => {
    const invalidRecords: NewUserDTO[] = [
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
      } as NewUserDTO;

      const validation = await validator.validateNew(invalidRecord, repo);
      if (validation.ok) {
        throw Error(
          `❌ Validación incorrecta para: ${JSON.stringify(invalidRecord)}`,
        );
      }

      const insercion = await service.add(invalidRecord);
      if (insercion.ok) {
        throw Error(
          `❌ Inserción incorrecta para: ${JSON.stringify(invalidRecord)}`,
        );
      }
    }
  });
});
