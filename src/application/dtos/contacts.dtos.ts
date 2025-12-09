import type { Criteria, StringQuery } from "./common";

/** DTO para agregar un nuevo contacto. */
export type NewContact = {
  /** ID del propietario de la agenda. */
  agendaOwnerId: number;
  /** ID del usuario a agregar. */
  userId: number;
  /** Alias para el contacto. */
  alias: string;
  /** Notas adicionales. */
  notes?: string;
  /** Etiquetas iniciales. */
  tags?: string[];
};

/** DTO para actualizar un contacto existente. */
export type ContactUpdate = {
  /** ID del propietario de la agenda. */
  agendaOwnerId: number;
  /** ID del usuario contacto. */
  userId: number;
  /** Nuevo alias. */
  alias: string;
  /** Nuevas notas. */
  notes?: string;
};

/** Criterios de búsqueda para contactos. */
export type ContactCriteria = Criteria & {
  /** Filtrar por alias. */
  alias?: StringQuery;
  /** Filtrar por propietario de la agenda. */
  agendaOwnerId?: number;
  /** Filtrar por ID de usuario contacto. */
  userId?: number;
  /** Filtrar por etiquetas. */
  tags?: string[];
};

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
