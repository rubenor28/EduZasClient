import { useUser } from "../context/UserContext";
import { Typography, Paper, Box } from "@mui/material";

/**
 * Página principal del panel de control que da la bienvenida al usuario.
 *
 * Esta página está diseñada para ser renderizada dentro del `AuthenticatedLayout`,
 * por lo que puede consumir de forma segura el `useUser` hook.
 */
export const Dashboard = () => {
  const { user } = useUser();

  return (
    <Paper sx={{ p: 4, mt: 2 }}>
      <Box textAlign="center">
        <Typography variant="h4" component="h1" gutterBottom>
          Bienvenido al Panel de Control
        </Typography>
        <Typography variant="h6">
          Sesión iniciada como: {user.email}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Navega a las diferentes secciones usando el menú superior.
        </Typography>
        <Typography variant="body2" sx={{ mt: 4, color: "text.secondary" }}>
          Tu rol es: {user.role}
        </Typography>
      </Box>
    </Paper>
  );
};
