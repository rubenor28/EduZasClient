import type { UserType } from "@domain";

/**
 * Representa una solicitud de cambio de rol para un usuario existente.
 *
 * @remarks
 * Este DTO encapsula el identificador del usuario y el nuevo rol que
 * se le debe asignar en el sistema.
 */
export type RolChangeDTO = {
  /** Identificador único del usuario */
  id: number;
  /** Nuevo rol a asignar al usuario */
  role: UserType;
};
