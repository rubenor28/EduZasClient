import { createBrowserRouter, Outlet } from "react-router-dom";
import { Login, Register, HomePage } from "./pages";
import { AdminPanel, ProfessorPanel, StudentPanel } from "./pages/panels";
import {
  ClasesAsesoradas,
  ContenidoAcademico,
  ClasesInscritas,
  Evaluaciones,
  DatabaseManagement,
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
    errorElement: <PublicErrorPage />,
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
      // --- Rutas Protegidas (agrupadas por layout) ---
      {
        element: (
          <UserProvider>
            <DashboardLayout />
          </UserProvider>
        ), // Layout con la Navbar principal
        errorElement: <ProtectedErrorPage />,
        children: [
          {
            index: true,
            element: <HomePage />, // Redirige al panel correcto
          },
          {
            path: "admin",
            element: <Outlet />,
            children: [
              { index: true, element: <AdminPanel /> },
              { path: "database", element: <DatabaseManagement /> },
              // Futuras sub-rutas de admin: /admin/users, /admin/stats...
            ],
          },
          {
            path: "professor",
            element: <Outlet />,
            children: [
              { index: true, element: <ProfessorPanel /> },
              { path: "courses", element: <ClasesAsesoradas /> },
              { path: "tests", element: <Evaluaciones /> },
              { path: "content", element: <ContenidoAcademico /> },
            ],
          },
          {
            path: "student",
            element: <Outlet />,
            children: [
              { index: true, element: <StudentPanel /> },
              { path: "courses", element: <ClasesInscritas /> },
            ],
          },
        ],
      },
    ],
  },
]);
