/**
 * Representa los codigos de estado HTTP los cuales pueden ser
 * manejados en una vista a manera de una pantalla de error
 */
export type ErrorStatusCodes = 403 | 404 | 500;

/**
 * Representa los posibles estados de renderizado de una vista principal de la aplicación.
 * Se utiliza una unión discriminada para poder asociar datos adicionales a ciertos estados,
 * como el código de error para el estado 'error'.
 */
export type AppViewStatus =
  | { type: "guest" }
  | { type: "user" }
  | { type: "unauthorized" }
  | { type: "forbid" };

/**
 * @interface AppViewStore
 * @description
 * Define el contrato para un store que gestiona el estado de la vista global de la aplicación.
 * Su propósito es controlar si se debe mostrar el contenido principal (una página),
 * una pantalla de carga, o una página de error HTTP (ej. 404, 403, 500).
 */
export interface AppViewStore {
  /**
   * El estado actual de la vista.
   * - `idle`: La aplicación está lista para mostrar el contenido principal.
   * - `loading`: La aplicación está realizando una carga inicial o una transición importante.
   * - `error`: Se ha producido un error que impide la visualización normal del contenido.
   */
  status: AppViewStatus;

  /**
   * Establece el contenido principal para ser mostrado y cambia el estado a 'idle'.
   * @param children El componente (página) a renderizar.
   */
  setIdle: (children: React.ReactNode) => void;

  /**
   * Cambia el estado de la vista a 'loading', usualmente ocultando cualquier contenido previo.
   */
  setLoading: () => void;

  /**
   * Cambia el estado de la vista a 'error' con un código HTTP específico.
   * @param code El código de error HTTP a mostrar (403, 404, o 500).
   *
   * @remarks
   * El manejo de errores 401 (No Autorizado) no se contempla directamente aquí.
   * Un error 401 es un evento de autenticación y su lógica (como redirigir a la página de login)
   * debería ser gestionada por un store de autenticación (`AuthStore`).
   * Este store de vista podría, como mucho, reaccionar a un estado de "cargando"
   * mientras el `AuthStore` realiza la redirección.
   */
  setError: (code: ErrorStatusCodes) => void;
}

/**
 * Define la firma para un hook de React que devuelve la instancia de AppViewStore.
 * Actúa como un contrato para la implementación del hook en la capa de infraestructura,
 * garantizando que cualquier implementación sea intercambiable.
 */
export type AppViewHook = () => AppViewStore;
