import { Ok, Err } from "ts-results";
import { InMemoryRepository } from "../../common/testing.repository"; // ruta donde tengas la clase base
import { UserType } from "persistence/users/enums";
import { StringQuery } from "persistence/common/entities";
import { StringSearchType } from "persistence/common/enums";
import { PaginatedQuery } from "persistence/common/entities";
import {
  User,
  NewUser,
  UserUpdate,
  UserCriteria,
} from "persistence/users/entities";
import { UserRepository } from "persistence/users/repositories";

/**
 * Repositorio en memoria para la entidad User.
 * - Diseñado para tests. No usar en producción.
 * - Implementa las mismas operaciones que {@link UserRepository}.
 */
class InMemoryUserRepository
  extends InMemoryRepository<number, User, NewUser, UserUpdate, UserCriteria>
  implements UserRepository
{
  constructor(pageSize = 10) {
    super(pageSize);
  }

  /**
   * Filtra todos los usuarios según los criterios provistos y devuelve
   * la página solicitada usando el helper `paginate` heredado.
   */
  async getBy(
    criteria: UserCriteria,
  ): Promise<PaginatedQuery<User, UserCriteria>> {
    const {
      gender,
      role,
      createdAt,
      modifiedAt,
      tuition,
      firstName,
      midName,
      fatherLastname,
      motherLastname,
      email,
    } = criteria as any;

    const results = this.all().filter((u) => {
      if (gender && u.gender !== gender) return false;
      if (role && u.role !== role) return false;
      if (
        createdAt &&
        !(
          u.createdAt instanceof Date &&
          u.createdAt.getTime() === new Date(createdAt).getTime()
        )
      )
        return false;
      if (
        modifiedAt &&
        !(
          u.modifiedAt instanceof Date &&
          u.modifiedAt.getTime() === new Date(modifiedAt).getTime()
        )
      )
        return false;

      if (!this.matchesStringQuery(u.tuition, tuition)) return false;
      if (!this.matchesStringQuery(u.firstName, firstName)) return false;
      if (!this.matchesStringQuery(u.midName, midName)) return false;
      if (!this.matchesStringQuery(u.fatherLastname, fatherLastname))
        return false;
      if (!this.matchesStringQuery(u.motherLastname, motherLastname))
        return false;
      if (!this.matchesStringQuery(u.email, email)) return false;

      // si hay otros filtros en rest, ignoramos o podrías extender
      return true;
    });

    return this.paginate(criteria as UserCriteria, results);
  }

  /**
   * Completa campos faltantes al crear una entidad User.
   * - Autogenera el id (ya lo hace la base), asigna createdAt/modifiedAt,
   *   default role y active = true si faltan.
   */
  autoGenerateRemainingFields(data: NewUser): User {
    const now = new Date();

    const user: User = {
      ...data,
      id: this.autoGenerateId(data),
      role: (data as any).role ?? (UserType.STUDENT as UserType),
      createdAt: (data as any).createdAt ?? now,
      modifiedAt: (data as any).modifiedAt ?? now,
    };

    // Asegura el id si la base lo generó (por si caller no pasó id)
    if (user.id === undefined) {
      // la clase base incrementa nextId; aquí solo lanzar error si falta (no debería)
      throw new Error(
        "autoGenerateRemainingFields requiere id ya generado por la base",
      );
    }

    return user;
  }

  /**
   * Devuelve el hash de la contraseña para un email.
   * Simula la misma API que el prisma repo: Ok(hash) | Err.EMPTY
   */
  async getPasswordHash(email: string) {
    const found = this.all().find((u) => u.email === email);
    if (!found) return Err.EMPTY;
    return Ok(found.password);
  }

  /**
   * Indica si un email ya está registrado.
   */
  async emailIsRegistered(email: string) {
    const result = await this.getBy({
      page: 1,
      email: {
        string: email,
        searchType: StringSearchType.EQ,
      },
    });

    return result.results.length === 1;
  }

  /**
   * Busca un usuario por matrícula (tuition).
   */
  async findByTuition(tuition: string) {
    const result = await this.getBy({
      page: 1,
      tuition: {
        string: tuition,
        searchType: StringSearchType.EQ,
      },
    });

    return result.results[0];
  }
}

/**
 * Exporta una instancia utilizable en tests.
 * Puedes crear instancias separadas en cada suite si necesitas aislamiento.
 */
export const inMemoryUserRepository = new InMemoryUserRepository();
