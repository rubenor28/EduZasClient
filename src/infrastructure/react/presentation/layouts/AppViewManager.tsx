import type { AppViewStatus, ErrorStatusCodes } from "@application";
import { useAppViewStore } from "@dependencies";

import {
  ForbiddenPage,
  LoadingPage,
  NotFoundPage,
  ServerErrorPage,
} from "@components";

/**
 * Props para el componente AppViewManager.
 */
type AppViewManagerProps = {
  /**
   * Los componentes hijos que se renderizarán cuando el estado de la aplicación sea 'idle'.
   * Típicamente, este será el componente de enrutamiento principal de la aplicación.
   */
  children: React.ReactNode;
};

/**
 * Componente de alto nivel que actúa como un controlador de vistas para toda la aplicación.
 *
 * Escucha el estado global de la vista desde `useAppViewStore` y decide qué renderizar:
 * - Si el estado es 'idle', renderiza los componentes hijos (la aplicación normal).
 * - Si el estado es 'loading' o 'error', interrumpe el renderizado normal para mostrar
 *   una pantalla de carga o de error a pantalla completa, sin cambiar la URL actual.
 *
 * @param props Las props del componente, incluyendo los hijos.
 * @returns El componente de vista apropiado según el estado global.
 */
export function AppViewManager({ children }: AppViewManagerProps) {
  const { status } = useAppViewStore();

  /**
   * Un mapa que asocia códigos de estado de error con sus componentes de página correspondientes.
   * Facilita la selección de la vista de error correcta.
   */
  const errorViews: Record<ErrorStatusCodes, React.ReactNode> = {
    403: <ForbiddenPage />,
    404: <NotFoundPage />,
    500: <ServerErrorPage />,
  };

  /**
   * Determina y devuelve el nodo de React a renderizar basado en el estado actual de la vista.
   * @param status El estado actual de la vista de la aplicación.
   * @returns El contenido a mostrar.
   */
  const getView = (status: AppViewStatus) => {
    if (status.type === "idle") return children;
    if (status.type === "loading") return <LoadingPage />;
    if (status.type === "error") return errorViews[status.code];
  };

  return getView(status);
}
