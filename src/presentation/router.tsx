import { createBrowserRouter, Outlet } from "react-router-dom";
import { Login, HomePage, Register, InitialSetup } from "./pages";
import { AdminPanel, ProfessorPanel, StudentPanel } from "./pages/panels";
import {
  ClasesAsesoradas,
  ContenidoAcademico,
  ClasesInscritas,
  Evaluaciones,
  DatabaseManagement,
  ContactsView,
  ResourceEditorPage,
  UsersView,
  TestEditorPage,
} from "./pages/views";
import {
  AuthErrorAs500Boundary,
  PublicErrorPage,
  ProtectedErrorPage,
} from "./components/errors";
import { SystemGuard } from "./components/auth/SystemGuard";
import { DashboardLayout } from "./layouts";
import { UserProvider } from "./context/UserContext";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SystemGuard />, // El guardián envuelve toda la aplicación
    errorElement: <PublicErrorPage />,
    children: [
      // --- Ruta de Configuración Inicial ---
      {
        path: "setup",
        element: <InitialSetup />,
      },
      // --- Rutas Públicas (accesibles solo si hay usuarios) ---
      {
        element: (
          <AuthErrorAs500Boundary>
            <Outlet />
          </AuthErrorAs500Boundary>
        ),
        children: [
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> },
        ],
      },
      // --- Rutas Protegidas (requieren autenticación) ---
      {
        element: (
          <UserProvider>
            <DashboardLayout />
          </UserProvider>
        ),
        errorElement: <ProtectedErrorPage />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "admin",
            element: <Outlet />,
            children: [
              { index: true, element: <AdminPanel /> },
              { path: "database", element: <DatabaseManagement /> },
              { path: "users", element: <UsersView /> },
            ],
          },
          {
            path: "professor",
            element: <Outlet />,
            children: [
              { index: true, element: <ProfessorPanel /> },
              { path: "courses", element: <ClasesAsesoradas /> },
              { path: "contacts", element: <ContactsView /> },
              { path: "tests", element: <Evaluaciones /> },
              { path: "tests/:testId", element: <TestEditorPage /> },
              { path: "content", element: <ContenidoAcademico /> },
              { path: "content/:resourceId", element: <ResourceEditorPage /> },
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
