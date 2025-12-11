import type { Criteria, StringQuery } from "./common";

/** Criterios de búsqueda para etiquetas de contactos. */
export type TagCriteria = Criteria & {
  /** Filtrar por texto de la etiqueta. */
  text?: StringQuery;
  /** Filtrar por ID de contacto asociado. */
  contactId?: number;
  /** Filtrar por propietario de la agenda. */
  agendaOwnerId?: number;
};

/** Identificador compuesto para una etiqueta de contacto. */
export type ContactTagId = {
  /** Texto de la etiqueta. */
  tag: string;
  /** ID del propietario de la agenda. */
  agendaOwnerId: number;
  /** ID del usuario contacto. */
  userId: number;
};
