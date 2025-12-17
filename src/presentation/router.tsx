import { createBrowserRouter, Outlet } from "react-router-dom";
import { Login, HomePage, InitialSetup } from "./pages";
import { AdminPanel, ProfessorPanel, StudentPanel } from "./pages/panels";
import {
  ClasesAsesoradas,
  ContenidoAcademico,
  ClasesInscritas,
  DatabaseManagement,
  ContactsView,
  ResourceEditorPage,
  UsersView,
  ClassContentView,
  ManageClassesView,
  ManageResourcesView,
} from "./pages/views";
import {
  AuthErrorAs500Boundary,
  PublicErrorPage,
  ProtectedErrorPage,
  NotFound,
} from "./components/errors";
import { SystemGuard } from "./components/auth/SystemGuard";
import { DashboardLayout } from "./layouts";
import { UserProvider } from "./context/UserContext";
import { ResourcePreviewPage } from "./pages/views/resource";
import { UserProfileView } from "./pages/views/users/UserProfileView";
import { MultipleChoiceQuestionBlock, OpenQuestionBlock } from "./components";
import { QuestionTypes } from "@domain";

/**
 * Configuración principal del enrutador de la aplicación (React Router).
 * Define la estructura de navegación, rutas protegidas, layouts y manejo de errores.
 */
export const router = createBrowserRouter([
  {
    path: "/",
    /**
     * SystemGuard: Componente de alto nivel que verifica el estado inicial del sistema.
     * - Si no hay usuarios registrados, redirige a /setup.
     * - Si hay usuarios, permite el acceso a las rutas hijas.
     */
    element: <SystemGuard />, // El guardián envuelve toda la aplicación
    errorElement: <PublicErrorPage />,
    children: [
      // --- Ruta de Configuración Inicial ---
      {
        path: "setup",
        element: <InitialSetup />,
      },
      /**
       * Rutas Públicas: Accesibles sin autenticación (Login, Registro).
       * AuthErrorAs500Boundary: Captura errores de autenticación inesperados en estas rutas
       * y los muestra como errores genéricos para no filtrar información.
       */
      {
        element: (
          <AuthErrorAs500Boundary>
            <Outlet />
          </AuthErrorAs500Boundary>
        ),
        children: [{ path: "login", element: <Login /> }],
      },
      /**
       * Rutas Protegidas: Requieren que el usuario haya iniciado sesión.
       * - UserProvider: Provee el contexto del usuario autenticado a todos los componentes hijos.
       * - DashboardLayout: Estructura visual común (barra lateral, cabecera) para el panel principal.
       * - ProtectedErrorPage: Maneja errores específicos de rutas protegidas (ej. 403 Forbidden).
       */
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
            path: "me",
            element: <UserProfileView />,
          },
          // --- Rutas de Administrador ---
          {
            path: "admin",
            element: <Outlet />,
            children: [
              { index: true, element: <AdminPanel /> },
              { path: "database", element: <DatabaseManagement /> },
              { path: "users", element: <UsersView /> },
              { path: "classes", element: <ManageClassesView /> },
              { path: "resources", element: <ManageResourcesView /> },
              { path: "content/:resourceId", element: <ResourceEditorPage /> },
            ],
          },
          // --- Rutas de Profesor ---
          {
            path: "professor",
            element: <Outlet />,
            children: [
              { index: true, element: <ProfessorPanel /> },
              { path: "courses", element: <ClasesAsesoradas /> },
              { path: "contacts", element: <ContactsView /> },
              {
                path: "tests",
                element: (
                  <MultipleChoiceQuestionBlock
                    initialState={{
                      title: "A",
                      imageUrl: "",
                      type: QuestionTypes.MultipleChoise,
                      options: {"id": "a"},
                      correctOption: "id"
                    }}
                    onChange={(c) => console.log(c)}
                    onDelete={() => console.log("Eliminao")}
                  />
                ),
              },
              { path: "content", element: <ContenidoAcademico /> },
              { path: "content/:resourceId", element: <ResourceEditorPage /> },
              {
                path: "classes/:classId/content",
                element: <ClassContentView />,
              },
              {
                path: "classes/resource/:classId/:resourceId",
                element: <ResourcePreviewPage />,
              },
              {
                path: "classes/test/:classId/:resourceId",
                element: <NotFound />,
              },
            ],
          },
          // --- Rutas de Estudiante ---
          {
            path: "student",
            element: <Outlet />,
            children: [
              { index: true, element: <StudentPanel /> },
              { path: "courses", element: <ClasesInscritas /> },
              {
                path: "classes/:classId/content",
                element: <ClassContentView />,
              },
              {
                path: "classes/resource/:classId/:resourceId",
                element: <ResourcePreviewPage />,
              },
              {
                path: "classes/test/:classId/:resourceId",
                element: <NotFound />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
