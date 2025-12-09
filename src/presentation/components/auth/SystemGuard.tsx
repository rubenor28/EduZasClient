import { useState, useEffect } from "react";
import {
  apiGet,
  AppError,
  errorService,
  InternalServerError,
} from "@application";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

/**
 * Componente "Guardián" de alto nivel.
 *
 * Responsabilidades:
 * 1. Verificar si el sistema ya ha sido inicializado (si existen usuarios).
 * 2. Redirigir a `/setup` si no hay usuarios (First Run).
 * 3. Bloquear el acceso a `/setup` si ya existen usuarios (Seguridad).
 * 4. Renderizar el contenido de la aplicación (`Outlet`) si todo está correcto.
 */
export const SystemGuard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasUsers, setHasUsers] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkSystemStatus = async () => {
      setIsLoading(true);
      try {
        const result = await apiGet<boolean>("/auth/have-users");
        setHasUsers(result);
      } catch (error) {
        errorService.notify(
          error instanceof AppError ? error : new InternalServerError(),
        );
        setHasUsers(true);
      } finally {
        setIsLoading(false);
      }
    };
    checkSystemStatus();
  }, [location]);

  if (isLoading || hasUsers === null) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const isSetupRoute = location.pathname === "/setup";

  // Si no hay usuarios y no estamos en la página de setup, forzar redirección a setup.
  if (!hasUsers && !isSetupRoute) {
    return <Navigate to="/setup" replace />;
  }

  // Si ya hay usuarios y se intenta acceder a setup, redirigir al login.
  if (hasUsers && isSetupRoute) {
    return <Navigate to="/login" replace />;
  }

  // En cualquier otro caso (sistema listo, o sistema no listo pero en la página de setup),
  // renderizar la ruta correspondiente.
  return <Outlet />;
};
