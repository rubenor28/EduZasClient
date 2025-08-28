import { Criteria, StringQuery } from "persistence/common/entities";
import { User } from "./user";

/**
 * Criterios de búsqueda para realizar consultas paginadas o filtradas de usuarios.
 *
 * Este DTO (Data Transfer Object) extiende el tipo base `Criteria`, permitiendo:
 * - Filtrado por fechas (`createdAt`, `modifiedAt`) mediante coincidencia exacta.
 * - Filtrado flexible por campos de texto usando el tipo `StringQuery`.
 *
 * Puede usarse como estructura de entrada para consultas en endpoints que listan usuarios
 * o realizan búsquedas avanzadas.
 *
 * @see Criteria
 * @see StringQuery
 */
export type UserCriteria = Criteria &
  Partial<Pick<User, "gender" | "role" | "createdAt" | "modifiedAt">> & 
  {
    /** Filtrar por matrícula del usuario. */
    tuition?: StringQuery;
    /** Filtrar por nombre de pila del usuario. */
    firstName?: StringQuery;
    /** Filtrar por nombre intermedio del usuario (si aplica). */
    midName?: StringQuery;
    /** Filtrar por apellido paterno del usuario. */
    fatherLastname?: StringQuery;
    /** Filtrar por apellido materno del usuario. */
    motherLastname?: StringQuery;
    /** Filtrar por dirección de correo electrónico. */
    email?: StringQuery;
  };
