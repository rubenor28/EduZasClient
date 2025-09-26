/**
 * Representa un objeto identificable por una clave única.
 *
 * @template I - Tipo del identificador (por ejemplo, `number`, `string`, `UUID`, etc.).
 */
export type Identifiable<I> = {
  /** Identificador único del objeto. */
  id: I;
};
