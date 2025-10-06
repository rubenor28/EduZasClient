/**
 * Representa el dominio de una clase académica en el sistema
 * @interface ClassDomain
 */
export type ClassDomain = {
  /** Identificador único de la clase */
  id: string;
  /** Indica si la clase está activa y disponible en el sistema */
  active: boolean;
  /** Nombre descriptivo de la clase */
  className: string;
  /** Color de la carta */
  color: string;
  /** Materia o asignatura asociada a la clase (opcional) */
  subject?: string;
  /** Sección o grupo específico de la clase (opcional) */
  section?: string;
};
