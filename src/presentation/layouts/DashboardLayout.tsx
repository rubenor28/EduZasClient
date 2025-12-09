import { Outlet } from "react-router-dom";
import { Navbar } from "../components/navbar/Navbar";
import { Box } from "@mui/material";

/**
 * Layout principal para la aplicación una vez autenticado.
 * Incluye la barra de navegación superior (`Navbar`) y un contenedor para el contenido dinámico.
 *
 * @remarks
 * Este componente debe estar envuelto en un `UserProvider` (ver `router.tsx`),
 * ya que la `Navbar` consume el contexto de usuario.
 */
export const DashboardLayout = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
