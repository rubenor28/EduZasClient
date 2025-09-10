import { Identifiable } from "persistence/common/entities";

/**
 * Representa una clase académica en el dominio de negocio.
 *
 * Extiende de {@link Identifiable} con clave de tipo `string`,
 * lo que asegura que toda clase tenga un identificador único.
 *
 * Incluye además información de contexto como asignatura,
 * sección y metadatos de auditoría.
 */
export type Class = Identifiable<string> & {
  /** Nombre descriptivo de la clase. */
  className: string;
  /** Materia asociada a la clase. */
  subject: string;
  /** Sección o grupo dentro de la materia. */
  section: string;
  /** Identificador numérico del propietario (usuario responsable). */
  ownerId: number;
  /** Fecha de creación del registro. */
  createdAt: Date;
  /** Fecha de última modificación del registro. */
  modifiedAt: Date;
};
