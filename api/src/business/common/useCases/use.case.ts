/**
 * Define el contrato genérico para un caso de uso en la capa de negocio.
 *
 * Un caso de uso representa una acción o proceso específico del dominio,
 * orquestando validaciones, servicios y repositorios.
 *
 * @template T - Tipo de los argumentos de entrada requeridos por el caso de uso.
 * @template U - Tipo del resultado que devuelve la ejecución.
 */
export interface UseCase<T, U> {
  /**
   * Ejecuta la lógica asociada al caso de uso.
   *
   * @param args - Datos de entrada necesarios para ejecutar el caso de uso.
   * @returns Una promesa que resuelve con el resultado de la operación.
   */
  execute(args: T): Promise<U>;
}
