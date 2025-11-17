/**
 * Tipo Result para manejo funcional de errores en TypeScript.
 *
 * @remarks
 * Representa el resultado de una operación que puede fallar, conteniendo
 * either un valor de éxito (`Ok`) o un error (`Err`).
 *
 * Inspirado en Result de Rust y Either de Haskell, proporciona una alternativa
 * type-safe a los throw/try/catch tradicionales.
 *
 * @typeParam T - Tipo del valor en caso de éxito
 * @typeParam E - Tipo del error en caso de fallo (por defecto: Error)
 *
 * @example
 * ```typescript
 * // Función que puede fallar
 * function divide(a: number, b: number): Result<number, string> {
 *   if (b === 0) return Err("Division by zero");
 *   return Ok(a / b);
 * }
 *
 * // Uso con pattern matching implícito
 * const result = divide(10, 2);
 * if (result.ok) {
 *   console.log("Resultado:", result.val); // 5
 * } else {
 *   console.error("Error:", result.val); // "Division by zero"
 * }
 * ```
 */
export type Result<T, E = Error> = Ok<T, E> | Err<T, E>;

/**
 * Variante de éxito del tipo Result.
 *
 * @typeParam T - Tipo del valor contenido
 * @typeParam E - Tipo del error (no utilizado en Ok)
 */
export interface Ok<T, E> {
  /** Indicador de éxito (true) */
  ok: true;
  /** Indicador de error (false) */
  err: false;
  /** Valor contenido en el resultado exitoso */
  val: T;

  /**
   * Extrae el valor contenido, lanzando una excepción si es llamado en Err.
   *
   * @returns El valor contenido de tipo T
   * @throws Nunca lanza en la variante Ok
   *
   * @example
   * ```typescript
   * const result = Ok(42);
   * const value = result.unwrap(); // 42
   * ```
   */
  unwrap(): T;

  /**
   * Extrae el valor contenido o devuelve un valor por defecto.
   *
   * @param defaultValue - Valor a devolver si el resultado es Err
   * @returns El valor contenido o el valor por defecto
   *
   * @example
   * ```typescript
   * const result = Ok(42);
   * const value = result.unwrapOr(0); // 42
   * ```
   */
  unwrapOr(defaultValue: T): T;

  /**
   * Transforma el valor contenido aplicando una función.
   *
   * @typeParam U - Tipo del nuevo valor
   * @param fn - Función de transformación T → U
   * @returns Nuevo Result con el valor transformado
   *
   * @example
   * ```typescript
   * const result = Ok(42);
   * const doubled = result.map(x => x * 2); // Ok(84)
   * ```
   */
  map<U>(fn: (value: T) => U): Result<U, E>;

  /**
   * Transforma el error contenido aplicando una función.
   * En la variante Ok, no hace nada.
   *
   * @typeParam F - Tipo del nuevo error
   * @param fn - Función de transformación E → F
   * @returns El mismo Result con el error potencialmente transformado
   *
   * @example
   * ```typescript
   * const result = Ok(42);
   * const stillOk = result.mapErr(e => new Error(e.message)); // Ok(42)
   * ```
   */
  mapErr<F>(fn: (error: E) => F): Result<T, F>;

  /**
   * Encadena operaciones que pueden fallar (flatMap).
   *
   * @typeParam U - Tipo del nuevo valor
   * @param fn - Función que devuelve otro Result
   * @returns Result de la operación encadenada
   *
   * @example
   * ```typescript
   * const result = Ok(42);
   * const chained = result.andThen(x => Ok(x.toString())); // Ok("42")
   * ```
   */
  andThen<U>(fn: (value: T) => Result<U, E>): Result<U, E>;

  /**
   * Maneja errores aplicando una función de recuperación.
   * En la variante Ok, no hace nada.
   *
   * @typeParam F - Tipo del nuevo error
   * @param fn - Función de recuperación E → Result<T, F>
   * @returns Result original o el resultado de la recuperación
   *
   * @example
   * ```typescript
   * const result = Ok(42);
   * const stillOk = result.orElse(e => Ok(0)); // Ok(42)
   * ```
   */
  orElse<F>(fn: (error: E) => Result<T, F>): Result<T, F>;

  /**
   * Aplica una de dos funciones dependiendo de la variante.
   *
   * @typeParam U - Tipo del valor de retorno de ambas funciones
   * @param fnOk - Función a ejecutar si el resultado es Ok
   * @param fnErr - Función a ejecutar si el resultado es Err
   * @returns El valor retornado por la función correspondiente
   *
   * @example
   * ```typescript
   * const result = Ok(42);
   * const message = result.match(
   *   (val) => `Success: ${val}`,
   *   (err) => `Error: ${err}`
   * );
   * console.log(message); // "Success: 42"
   *
   * const result2 = Err("Failure");
   * const message2 = result2.match(
   *   (val) => `Success: ${val}`,
   *   (err) => `Error: ${err}`
   * );
   * console.log(message2); // "Error: Failure"
   * ```
   */
  match<U>(fnOk: (value: T) => U, fnErr: (value: E) => U): U;
}

/**
 * Variante de error del tipo Result.
 *
 * @typeParam T - Tipo del valor (no utilizado en Err)
 * @typeParam E - Tipo del error contenido
 */
export interface Err<T, E> {
  /** Indicador de éxito (false) */
  ok: false;
  /** Indicador de error (true) */
  err: true;
  /** Error contenido en el resultado fallido */
  val: E;

  /**
   * Intenta extraer el valor contenido, lanzando el error.
   *
   * @returns Nunca retorna normalmente, siempre lanza
   * @throws El error contenido de tipo E
   *
   * @example
   * ```typescript
   * const result = Err("Error message");
   * try {
   *   result.unwrap(); // Lanza "Error message"
   * } catch (e) {
   *   console.error(e); // "Error message"
   * }
   * ```
   */
  unwrap(): never;

  /**
   * Extrae el valor contenido o devuelve un valor por defecto.
   *
   * @param defaultValue - Valor a devolver
   * @returns El valor por defecto (nunca el valor contenido)
   *
   * @example
   * ```typescript
   * const result = Err("Error");
   * const value = result.unwrapOr(0); // 0
   * ```
   */
  unwrapOr(defaultValue: T): T;

  /**
   * Transforma el valor contenido aplicando una función.
   * En la variante Err, no hace nada.
   *
   * @typeParam U - Tipo del nuevo valor
   * @param fn - Función de transformación T → U
   * @returns El mismo Result Err (sin cambios)
   *
   * @example
   * ```typescript
   * const result = Err("Error");
   * const stillErr = result.map(x => x * 2); // Err("Error")
   * ```
   */
  map<U>(fn: (value: T) => U): Result<U, E>;

  /**
   * Transforma el error contenido aplicando una función.
   *
   * @typeParam F - Tipo del nuevo error
   * @param fn - Función de transformación E → F
   * @returns Nuevo Result Err con el error transformado
   *
   * @example
   * ```typescript
   * const result = Err("Error");
   * const transformed = result.mapErr(e => new Error(e)); // Err(Error("Error"))
   * ```
   */
  mapErr<F>(fn: (error: E) => F): Result<T, F>;

  /**
   * Encadena operaciones que pueden fallar (flatMap).
   * En la variante Err, no ejecuta la función.
   *
   * @typeParam U - Tipo del nuevo valor
   * @param fn - Función que devuelve otro Result
   * @returns El mismo Result Err (sin cambios)
   *
   * @example
   * ```typescript
   * const result = Err("Error");
   * const stillErr = result.andThen(x => Ok(x.toString())); // Err("Error")
   * ```
   */
  andThen<U>(fn: (value: T) => Result<U, E>): Result<U, E>;

  /**
   * Maneja errores aplicando una función de recuperación.
   *
   * @typeParam F - Tipo del nuevo error
   * @param fn - Función de recuperación E → Result<T, F>
   * @returns Resultado de la función de recuperación
   *
   * @example
   * ```typescript
   * const result = Err("Error");
   * const recovered = result.orElse(e => Ok(0)); // Ok(0)
   * ```
   */
  orElse<F>(fn: (error: E) => Result<T, F>): Result<T, F>;

  /**
   * Aplica una de dos funciones dependiendo de la variante.
   *
   * @typeParam U - Tipo del valor de retorno de ambas funciones
   * @param fnOk - Función a ejecutar si el resultado es Ok
   * @param fnErr - Función a ejecutar si el resultado es Err
   * @returns El valor retornado por la función correspondiente
   *
   * @example
   * ```typescript
   * const result = Ok(42);
   * const message = result.match(
   *   (val) => `Success: ${val}`,
   *   (err) => `Error: ${err}`
   * );
   * console.log(message); // "Success: 42"
   *
   * const result2 = Err("Failure");
   * const message2 = result2.match(
   *   (val) => `Success: ${val}`,
   *   (err) => `Error: ${err}`
   * );
   * console.log(message2); // "Error: Failure"
   * ```
   */
  match<U>(fnOk: (value: T) => U, fnErr: (value: E) => U): U;
}

/**
 * Función constructora para la variante Ok del Result.
 *
 * @typeParam T - Tipo del valor
 * @typeParam E - Tipo del error (inferido como never)
 * @param val - Valor a contener
 * @returns Result Ok con el valor contenido
 *
 * @example
 * ```typescript
 * const success = Ok(42); // Result<number, never>
 * const message = Ok("Hello"); // Result<string, never>
 * ```
 */
export function Ok<T, E = never>(val: T): Result<T, E> {
  return {
    ok: true,
    err: false,
    val,
    unwrap: () => val,
    unwrapOr: () => val,
    map: <U>(fn: (value: T) => U) => Ok(fn(val)) as Result<U, E>,
    mapErr: <F>(_fn: (error: E) => F) => Ok(val) as Result<T, F>,
    andThen: (fn) => fn(val),
    orElse: () => Ok(val) as Result<T, any>,
    match: (fnOk, _) => fnOk(val),
  };
}

/**
 * Función constructora para la variante Err del Result.
 *
 * @typeParam T - Tipo del valor (inferido del contexto)
 * @typeParam E - Tipo del error
 * @param val - Error a contener
 * @returns Result Err con el error contenido
 *
 * @example
 * ```typescript
 * const error = Err("Failed"); // Result<never, string>
 * const mathError = Err(new Error("Division by zero")); // Result<never, Error>
 * ```
 */
export function Err<T, E>(val: E): Result<T, E> {
  return {
    ok: false,
    err: true,
    val,
    unwrap: () => {
      throw val;
    },
    unwrapOr: (defaultValue) => defaultValue,
    map: <U>(_fn: (value: T) => U) => Err(val) as Result<U, E>,
    mapErr: <F>(fn: (error: E) => F) => Err(fn(val)) as Result<T, F>,
    andThen: () => Err(val) as Result<any, E>,
    orElse: (fn) => fn(val),
    match: (_, fnErr) => fnErr(val),
  };
}
