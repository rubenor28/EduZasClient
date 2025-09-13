import bcrypt from "bcrypt";
import { Hasher } from "./hasher";
import { SALT_OR_ROUNDS } from "config";

/**
 * Implementación del `Hasher` que utiliza la biblioteca **bcrypt** de forma síncrona.
 *
 * Este objeto cumple con el contrato de la interfaz `Hasher`, utilizando `bcrypt.hashSync`
 * para la creación de hashes y `bcrypt.compareSync` para su verificación.
 *
 * El número de rondas de salting (costo computacional) se controla a través
 * de la constante `SALT_OR_ROUNDS` importada desde la configuración.
 *
 * @implements {Hasher}
 */
export const bcryptHasher: Hasher = {
  /**
   * {@inheritDoc Hasher.hash}
   * Implementado con `bcrypt.hashSync`.
   */
  hash(input) {
    return bcrypt.hashSync(input, SALT_OR_ROUNDS);
  },

  /**
   * {@inheritDoc Hasher.matches}
   * Implementado con `bcrypt.compareSync`.
   */
  matches(input, hash) {
    return bcrypt.compareSync(input, hash);
  },
};
