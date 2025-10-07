import type { ClassDomain, Result } from "@domain";
import type {
  ClassCriteriaDTO,
  ClassUpdateDTO,
  NewClassDTO,
  PaginatedQuery,
} from "@application";
import type { ServiceError } from "domain/errors/ServiceErrors";

/**
 * Interfaz que define los servicios disponibles para la gestión de clases académicas
 * @interface ClassService
 */
export interface ClassService {
  /**
   * Crea una nueva clase académica en el sistema
   * @param newClass - Datos de la nueva clase a crear
   * @returns Promesa que resuelve con el dominio de la clase creada
   */
  createClass(
    newClass: NewClassDTO,
  ): Promise<Result<ClassDomain, ServiceError>>;

  /**
   * Actualiza una clase académica existente en el sistema.
   * @param data - Datos para actualizar la clase.
   * @returns Una promesa que se resuelve con el dominio de la clase actualizada o un error de servicio.
   */
  updateClass(data: ClassUpdateDTO): Promise<Result<ClassDomain, ServiceError>>;

  /**
   * Elimina una clase académica existente en el sistema
   * @param id - ID de la clase
   * @returns Una promesa que se resuelve con los datos de la clase eliminada o un error de servicio
   */
  deleteClass(id: string): Promise<Result<ClassDomain, ServiceError>>;

  /**
   * Obtiene las clases asignadas al usuario autenticado
   * @param criteria - Criterios de búsqueda y paginación para filtrar las clases
   * @returns Promesa que resuelve con el resultado paginado de clases o error de autenticación
   * @remarks
   * El backend utiliza el token de autenticación para:
   * - Verificar que el usuario esté autenticado
   * - Agregar automáticamente el ID del usuario como criterio de filtro adicional
   * - Devolver error 403 si un alumno intenta acceder a este endpoint
   */
  getAssignedClasses(
    criteria: ClassCriteriaDTO,
  ): Promise<
    Result<PaginatedQuery<ClassDomain, ClassCriteriaDTO>, ServiceError>
  >;

  getEnrolledClasses(
    criteria: ClassCriteriaDTO,
  ): Promise<
    Result<PaginatedQuery<ClassDomain, ClassCriteriaDTO>, ServiceError>
  >;
}
