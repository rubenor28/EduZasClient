/**
 * Define un objeto identificable por un campo `id`.
 *
 * @typeParam I - Tipo del identificador (por ejemplo, `number` o `string`)
 */
export type Identifiable<I> = {
  /** Identificador único del objeto */
  id: I;
};
