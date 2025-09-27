/**
 * Representa una respuesta de la API que incluye un mensaje y datos genéricos.
 *
 * @typeParam T - Tipo de los datos devueltos en la respuesta.
 *
 * @property message - Mensaje informativo o de confirmación.
 * @property data - Datos devueltos de tipo T.
 */
export type WithDataResponse<T> = {
  /** Mensaje informativo o de confirmacion */
  message: string;
  /** Datos devueltos de tipo T */
  data: T;
};
