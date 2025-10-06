/**
 * DTO para la actualización de clases académicas en el sistema
 * @interface ClassUpdateDTO
 */
export type ClassUpdateDTO = {
  /** Identificador único de la clase a actualizar */
  id: string;
  /** Nuevo estado activo/inactivo para la clase */
  active: boolean;
  /** Nuevo nombre para la clase */
  className: string;
  /** Color de la carta de la clase */
  color: string;
  /** Nueva materia o asignatura asociada (opcional) */
  subject?: string;
  /** Nueva sección o grupo de la clase (opcional) */
  section?: string;
};
