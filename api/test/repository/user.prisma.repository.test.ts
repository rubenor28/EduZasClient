import { prismaUserRepository } from "../../src/repository/user.prisma.repository";
import {
  StringSearchType,
  type NewUserDTO,
  type User,
  type UserCriteriaDTO,
} from "../../src/model";
import { prisma } from "../../src/config";

describe("Operaciones CRUD userRepository", () => {
  const repo = prismaUserRepository;

  const testNew: NewUserDTO = {
    email: "aaaabbbbccceee@gmail.com",
    tuition: "ABC012345I", // formato válido según tu schema
    firstName: "Ruben",
    midName: undefined,
    fatherLastname: "Roman",
    motherLastname: undefined,
    password: "1234Ab!@",
    gender: "Masculino",
  };

  const testCreated: Partial<User> = {
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
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        EXECUTE (
          SELECT 'TRUNCATE TABLE ' || string_agg(quote_ident(table_name), ', ') || ' RESTART IDENTITY CASCADE'
          FROM information_schema.tables
          WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
        );
      END
      $$;
    `);
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
    const result = await repo.getBy({} as UserCriteriaDTO, page);
    expect(result.page).toBe(page);
    expect(result.totalPages).toBe(
      Math.ceil(15 / (await import("../../src/config")).PAGE_SIZE),
    );
    expect(result.results.length).toBeGreaterThan(0);
  });

  test("Filtrar por email exacto", async () => {
    await repo.add(testNew);
    await repo.add({ ...testNew, email: "other@example.com" });
    const result = await repo.getBy(
      { email: { string: testNew.email, searchType: StringSearchType.EQ } },
      1,
    );
    expect(result.results).toHaveLength(1);
    expect(result.results[0]?.email).toBe(testNew.email);
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
    const result = await repo.getBy(
      { tuition: { string: "ABC", searchType: StringSearchType.LIKE } },
      1,
    );
    expect(result.results).toHaveLength(1);
    expect(result.results[0]?.tuition).toContain("ABC");
  });

  test("Filtrar combinando criterios exactos (email+firstName)", async () => {
    await repo.add({
      ...testNew,
      email: "combo1@test.com",
      firstName: "Ana",
    });
    await repo.add({
      ...testNew,
      email: "combo2@test.com",
      firstName: "Luis",
    });

    const criteria: UserCriteriaDTO = {
      email: { string: "combo1@test.com", searchType: StringSearchType.EQ },
      firstName: { string: "Ana", searchType: StringSearchType.EQ },
    };
    const result = await repo.getBy(criteria, 1);
    expect(result.results).toHaveLength(1);
    expect(result.results[0]?.firstName).toBe("Ana");
  });

  test("Filtrar combinando criterios parciales (email+firstName)", async () => {
    await repo.add({
      ...testNew,
      email: "combo1@test.com",
      firstName: "Ana",
    });

    await repo.add({
      ...testNew,
      email: "combo2@test.com",
      firstName: "Luis",
    });

    await repo.add({
      ...testNew,
      email: "some@test.com",
      firstName: "Luis",
    });

    const criteria: UserCriteriaDTO = {
      email: { string: "so", searchType: StringSearchType.LIKE },
      firstName: { string: "L", searchType: StringSearchType.LIKE },
    };

    const result = await repo.getBy(criteria, 1);
    expect(result.results).toHaveLength(1);
  });
});
