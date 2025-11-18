import { Navigate, Outlet } from "react-router-dom";
import { type ReactNode } from "react";
import { GlobalErrorDisplay } from "@presentation";

interface Props {
  children?: ReactNode;
}

// TODO: Reemplazar con la lógica de autenticación real (ej. un hook `useAuth`).
const useAuth = () => {
  // Por ahora, simulamos un usuario siempre autenticado.
  // En una app real, esto podría venir de un contexto, Redux, etc.
  return {
    isAuthenticated: true, 
    // user: { role: 'admin' } 
  };
};

/**
 * Un layout para proteger rutas. Verifica si el usuario está autenticado.
 * Si no lo está, redirige a la página de login.
 * Si lo está, renderiza el contenido de la ruta solicitada.
 *
 * También envuelve el contenido en `GlobalErrorDisplay` para capturar errores
 * asíncronos que no son manejados por `errorElement`.
 */
export function ProtectedRoute({ children }: Props) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // El usuario no está autenticado, redirigir a la página de login.
    // `replace` evita que la ruta protegida se agregue al historial de navegación.
    return <Navigate to="/login" replace />;
  }

  // El usuario está autenticado, renderiza el Outlet (rutas hijas) o los children.
  // GlobalErrorDisplay sigue siendo útil aquí para los errores del `errorService`.
  return (
    <GlobalErrorDisplay>
      {children ?? <Outlet />}
    </GlobalErrorDisplay>
  );
}
