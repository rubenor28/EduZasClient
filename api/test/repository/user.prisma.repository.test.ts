import { prismaUserRepository } from "../../src/repository/user.prisma.repository";
import type { NewUserDTO } from "../../src/model";
import { prisma } from "../../src/config";

describe("Operaciones CRUD prismaUserRepository", () => {
  afterAll(async () => {
    await prisma.$connect();

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

  test("Agregar un registro", async () => {
    const newUsr: NewUserDTO = {
      email: "aaaabbbbccceee@gmail.com",
      tuition: "rrrsssrrrooo2202228",
      firstName: "Ruben",
      midName: undefined,
      fatherLastname: "Roman",
      motherLastname: undefined,
      password: "1234",
      gender: "Masculino",
    };

    const insercion = await prismaUserRepository.add(newUsr);

    expect(insercion).toEqual(
      expect.objectContaining({
        ...newUsr,
        id: 1,
        active: true,
        createdAt: expect.any(Date),
        modifiedAt: expect.any(Date),
      }),
    );
  });
});
