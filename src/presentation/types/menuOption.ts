/**
 * Representa una opción de menú en la interfaz de usuario.
 * Utilizado para generar listas de acciones o navegación dinámica.
 */
export type MenuOption = {
  /** Nombre visible de la opción. */
  name: string;
  /** Función a ejecutar al seleccionar la opción. */
  callback: () => void;
};
