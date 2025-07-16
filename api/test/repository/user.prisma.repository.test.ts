import { prismaUserRepository } from "../../src/repository/user.prisma.repository";
import { User } from "../../src/model";

describe("Operaciones CRUD prismaUserRepository", () => {
  test("Agregar un registro", async () => {
    const insercion = await prismaUserRepository.add({
      email: "aaaabbbbccceee@gmail.com",
      tuition: "rrrsssrrrooo2202228",
      firstName: "Ruben",
      midName: undefined,
      fatherLastname: "Roman",
      motherLastname: undefined,
      password: "1234",
      gender: "Masculino",
    });

    expect(insercion).toBe({
      email: "aaaabbbbccceee@gmail.com",
      tuition: "rrrsssrrrooo2202228",
      firstName: "Ruben",
      midName: undefined,
      fatherLastname: "Roman",
      motherLastname: undefined,
      password: "1234",
      gender: "Masculino",
    });
  });
});
