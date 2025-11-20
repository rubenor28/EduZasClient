import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

// Mapa de roles a rutas por defecto
const roleToPathMap: { [key: number]: string } = {
  0: "/enrollments", // Estudiante
  1: "/courses", // Profesor
  2: "/admin-panel", // Administrador
};

/**
 * Componente que redirige al usuario a su página de inicio por defecto
 * basada en su rol, una vez que está autenticado.
 * Muestra un spinner de carga brevemente mientras se resuelve la redirección.
 */
export const HomePage = () => {
  const { user } = useUser(); // Asume que UserProvider ya ha cargado al usuario
  const navigate = useNavigate();

  useEffect(() => {
    // Determina la ruta por defecto o usa '/dashboard' como fallback
    const defaultPath = roleToPathMap[user.role] || "/dashboard";
    navigate(defaultPath, { replace: true });
  }, [user, navigate]); // Dependencias para re-ejecutar si el usuario o navigate cambian

  // Muestra un indicador de carga mientras se redirige
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <CircularProgress sx={{ mb: 2 }} />
      <Typography variant="h6">Redirigiendo...</Typography>
    </Box>
  );
};
