import type { AuthErrors, ClassDomain, Result } from "@domain";
import type {
  ClassCriteriaDTO,
  NewClassDTO,
  PaginatedQuery,
} from "@application";

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
  createClass(newClass: NewClassDTO): Promise<Result<ClassDomain, AuthErrors>>;

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
  getMyAssignedClasses(
    criteria: ClassCriteriaDTO,
  ): Promise<Result<PaginatedQuery<ClassDomain, ClassCriteriaDTO>, AuthErrors>>;
}
