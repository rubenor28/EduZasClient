/**
 * Género de una persona o usuario.
 *
 * Este `enum` se utiliza para representar el género de forma explícita
 * y legible, facilitando la validación, visualización y manejo de datos.
 */
export const Gender = {
  /** Género masculino. */
  MALE: "MALE",
  /** Género femenino. */
  FEMALE: "FEMALE",
  /** Otro género o no especificado. */
  OTHER: "OTHER",
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];
