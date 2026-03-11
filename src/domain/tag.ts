/**
 * Representa una etiqueta utilizada para categorizar contactos en la agenda.
 */
export type Tag = {
  /** Identificador único de la etiqueta. */
  id?: number;
  /** Texto de la etiqueta. */
  text: string;
  /** Fecha de creación de la etiqueta. */
  createdAt: Date;
};
