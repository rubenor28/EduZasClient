import { createBrowserRouter, Outlet } from "react-router-dom";
import { Login, Register, Dashboard, HomePage } from "./pages";
import {
  AdminPanel,
  ClasesAsesoradas,
  ContenidoAcademico,
  ClasesInscritas,
  Evaluaciones,
} from "./pages/views";
import {
  AuthErrorAs500Boundary,
  PublicErrorPage,
  ProtectedErrorPage,
} from "./components/errors";
import { DashboardLayout } from "./layouts";
import { UserProvider } from "./context/UserContext";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    errorElement: <ProtectedErrorPage />,
    children: [
      // --- Rutas Públicas ---
      {
        element: (
          <AuthErrorAs500Boundary>
            <Outlet />
          </AuthErrorAs500Boundary>
        ),
        errorElement: <PublicErrorPage />,
        children: [
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> },
        ],
      },

      // --- Rutas Protegidas ---
      {
        element: <UserProvider><Outlet /></UserProvider>,
        children: [
          // Layout para vistas con Navbar
          {
            element: <DashboardLayout />,
            children: [
              {
                path: "/", // La raíz renderiza HomePage para la redirección dinámica
                element: <HomePage />,
              },
              { path: "admin-panel", element: <AdminPanel /> },
              { path: "courses", element: <ClasesAsesoradas /> },
              { path: "tests", element: <Evaluaciones /> },
              { path: "contents", element: <ContenidoAcademico /> },
              { path: "enrollments", element: <ClasesInscritas /> },
              { path: "reports", element: <Dashboard /> },
            ],
          },
          // rutas autenticadas que no usan el DashboardLayout
          // { path: "perfil", element: <ProfilePage /> }
        ],
      },
    ],
  },
]);
