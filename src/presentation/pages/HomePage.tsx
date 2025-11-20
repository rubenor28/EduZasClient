import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

// Mapa de roles a rutas de panel por defecto
const roleToPathMap: { [key: number]: string } = {
  0: "/student",    // Estudiante
  1: "/professor",  // Profesor
  2: "/admin",      // Administrador
};

/**
 * Componente que redirige al usuario a su panel principal por defecto
 * basada en su rol, una vez que está autenticado.
 */
export const HomePage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Determina la ruta por defecto o usa '/student' como fallback seguro.
    const defaultPath = roleToPathMap[user.role] || "/student";
    navigate(defaultPath, { replace: true });
  }, [user, navigate]);

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
