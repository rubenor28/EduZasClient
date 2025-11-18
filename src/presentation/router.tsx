import { createBrowserRouter, Outlet } from "react-router-dom";
import { Login, Register, Home } from "./pages";
import {
  NotFound,
  AuthErrorAs500Boundary,
  PublicErrorPage,
  ProtectedErrorPage,
} from "./components/errors";
import { ProtectedRoute } from "./layouts";

export const router = createBrowserRouter([
  {
    path: "/",
    // El elemento raíz ahora es solo un Outlet, permitiendo anidación.
    element: <Outlet />,
    children: [
      // --- Rutas Públicas ---
      // Este grupo de rutas no requiere autenticación.
      {
        // Envolvemos el Outlet con el boundary que convierte errores 401/403 en 500.
        element: (
          <AuthErrorAs500Boundary>
            <Outlet />
          </AuthErrorAs500Boundary>
        ),
        // `PublicErrorPage` maneja los errores de renderizado para este grupo.
        errorElement: <PublicErrorPage />,
        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "register",
            element: <Register />,
          },
        ],
      },

      // --- Rutas Protegidas ---
      // Este grupo de rutas requiere autenticación.
      {
        // `ProtectedRoute` verifica la autenticación y contiene el `GlobalErrorDisplay`.
        element: <ProtectedRoute />,
        // `ProtectedErrorPage` maneja los errores de renderizado para este grupo.
        errorElement: <ProtectedErrorPage />,
        children: [
          {
            // La ruta raíz ("/") ahora está protegida.
            index: true,
            element: <Home />,
          },
          // ... aquí se pueden agregar más rutas protegidas ...
        ],
      },
    ],
  },
  {
    // La ruta catch-all para 404 se mantiene al final.
    path: "*",
    element: <NotFound />,
  },
]);
