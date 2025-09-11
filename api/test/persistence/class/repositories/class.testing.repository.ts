import { ClassRepository } from "persistence/class/repositories";
import { InMemoryRepository } from "../../common/testing.repository";
import {
  Class,
  ClassCriteria,
  ClassUpdate,
  NewClass,
} from "persistence/class/entities";
import { PaginatedQuery } from "persistence/common/entities";

class InMemoryClassRepository
  extends InMemoryRepository<
    string,
    Class,
    NewClass,
    ClassUpdate,
    ClassCriteria
  >
  implements ClassRepository
{
  /**
   * Filtra todas las clases de acuerdo a los criterios proporcionados
   * y devuelve una respuesta paginada
   */
  override getBy(
    criteria: ClassCriteria,
  ): Promise<PaginatedQuery<Class, ClassCriteria>> {
    const { ownerId, section, subject, className } = criteria;

    const results = this.all().filter((c) => {
      if (ownerId && c.ownerId !== ownerId) return false;

      if (!this.matchesStringQuery(c.section, section)) return false;
      if (!this.matchesStringQuery(c.subject, subject)) return false;
      if (!this.matchesStringQuery(c.className, className)) return false;

      return true;
    });

    return this.paginate(criteria, results);
  }

  /**
   * Completa campos faltantes al crear una entidad Class.
   * - Asigna createdAt/modifiedAt,
   */
  override autoGenerateRemainingFields(data: NewClass): Class {
    const date = new Date();
    return {
      ...data,
      createdAt: date,
      modifiedAt: date,
    };
  }
}

export const inMemoryClassRepository = new InMemoryClassRepository();
