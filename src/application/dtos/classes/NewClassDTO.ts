/**
 * DTO para la creación de nuevas clases académicas en el sistema
 * @interface NewClassDTO
 */
export type NewClassDTO = {
  /** Nombre descriptivo de la nueva clase (campo requerido) */
  className: string;
  /** Color de la carta de la nueva clase (campo requerido) */
  color: string;
  /** Materia o asignatura asociada a la nueva clase (opcional) */
  subject?: string;
  /** Sección o grupo específico de la nueva clase (opcional) */
  section?: string;
};
