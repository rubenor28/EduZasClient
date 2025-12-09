/** Representa un contacto en la agenda de un usuario. */
export type Contact = {
  /** ID del usuario propietario de la agenda. */
  agendaOwnerId: number;
  /** ID del usuario agregado como contacto. */
  userId: number;
  /** Nombre o alias personalizado para el contacto. */
  alias: string;
  /** Notas opcionales sobre el contacto. */
  notes?: string;
};
