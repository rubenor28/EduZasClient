import { prismaUserRepository } from "../../src/repository/user.prisma.repository";
import {
  Gender,
  StringSearchType,
  UserType,
  type NewUserDTO,
  type User,
  type UserCriteriaDTO,
} from "../../src/model";
import { PAGE_SIZE, prisma } from "../../src/config";

describe("Operaciones CRUD Repositorio Usuarios", () => {
  const repo = prismaUserRepository;

  const testNew: NewUserDTO = {
    email: "aaaabbbbccceee@gmail.com",
    tuition: "ABC012345I",
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

  // Desconecta al finalizar todos los tests
  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("Agregar un registro", async () => {
    const insercion = await repo.add(testNew);
    expect(insercion).toEqual(testCreated);
  });

  test("Obtener un registro existente", async () => {
    await repo.add(testNew);
    const record = await repo.get(1);
    expect(record).toEqual(testCreated);
  });

  test("Obtener un registro inexistente", async () => {
    const record = await repo.get(999);
    expect(record).toBeUndefined();
  });

  test("Actualizar un registro", async () => {
    const created = await repo.add(testNew);
    const updateData = { ...created, firstName: "Carlos" };
    const updated = await repo.update(updateData);
    expect(updated.firstName).toBe("Carlos");
    expect(updated.id).toBe(created.id);
  });

  test("Eliminar un registro", async () => {
    await repo.add(testNew);
    const deleted = await repo.delete(1);
    expect(deleted.id).toBe(1);

    // Ahora ya no existe
    const record = await repo.get(1);
    expect(record).toBeUndefined();
  });

  test("Listar con paginación y filtros vacíos", async () => {
    // Inserta varios usuarios
    for (let i = 0; i < 15; i++) {
      await repo.add({
        ...testNew,
        email: `user${i}@test.com`,
        tuition: `AAA01234${(50 + i) % 100}`,
      });
    }
    const page = 2;
    const result = await repo.getBy({ page });
    expect(result.page).toBe(page);
    expect(result.totalPages).toBe(Math.ceil(15 / PAGE_SIZE));
    expect(result.results.length).toBeGreaterThan(0);
  });

  test("Filtrado exacto matricula", async () => {
    await repo.add(testNew);
    await repo.add({
      ...testNew,
      email: "notImportantField",
      tuition: "asdjakslda",
    });

    const resultTuition = await repo.getBy({
      page: 1,
      tuition: { string: testNew.tuition, searchType: StringSearchType.EQ },
    });

    expect(resultTuition.results).toHaveLength(1);
    expect(resultTuition.results[0]?.tuition).toBe(testNew.tuition);
  });

  test("Filtrado exacto correo", async () => {
    await repo.add(testNew);

    await repo.add({
      ...testNew,
      email: "other@example.com",
      tuition: "notImportantField",
    });

    const resultEmail = await repo.getBy({
      page: 1,
      email: { string: testNew.email, searchType: StringSearchType.EQ },
    });

    expect(resultEmail.results).toHaveLength(1);
    expect(resultEmail.results[0]?.email).toBe(testNew.email);
  });

  test("Filtrar por matrícula parcial (contains)", async () => {
    await repo.add({
      ...testNew,
      tuition: "ABC012345I",
      email: "combo1@test.com",
    });
    await repo.add({
      ...testNew,
      tuition: "XYZI123456",
      email: "combo2@test.com",
    });
    const result = await repo.getBy({
      page: 1,
      tuition: { string: "ABC", searchType: StringSearchType.LIKE },
    });
    expect(result.results).toHaveLength(1);
    expect(result.results[0]?.tuition).toContain("ABC");
  });

  test("Filtrar combinando criterios exactos (email+firstName)", async () => {
    await repo.add({
      ...testNew,
      email: "combo1@test.com",
      tuition: "1",
      firstName: "Ana",
    });

    await repo.add({
      ...testNew,
      email: "combo2@test.com",
      tuition: "2",
      firstName: "Luis",
    });

    const criteria: UserCriteriaDTO = {
      page: 1,
      email: { string: "combo1@test.com", searchType: StringSearchType.EQ },
      firstName: { string: "Ana", searchType: StringSearchType.EQ },
    };

    const result = await repo.getBy(criteria);

    expect(result.results).toHaveLength(1);
    expect(result.results[0]?.firstName).toBe("Ana");
  });

  test("Filtrar combinando criterios parciales (email+firstName)", async () => {
    await repo.add({
      ...testNew,
      email: "combo1@test.com",
      tuition: "1",
      firstName: "Ana",
    });

    await repo.add({
      ...testNew,
      email: "combo2@test.com",
      tuition: "2",
      firstName: "Luis",
    });

    await repo.add({
      ...testNew,
      email: "some@test.com",
      firstName: "Luis",
    });

    const criteria: UserCriteriaDTO = {
      page: 1,
      email: { string: "so", searchType: StringSearchType.LIKE },
      firstName: { string: "L", searchType: StringSearchType.LIKE },
    };

    const result = await repo.getBy(criteria);

    expect(result.results).toHaveLength(1);
  });
});
