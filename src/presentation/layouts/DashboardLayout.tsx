import { Outlet } from "react-router-dom";
import { Navbar } from "../components/navbar/Navbar";
import { Box } from "@mui/material";

/**
 * Layout para las vistas principales del dashboard que incluyen la barra de navegación.
 *
 * Este componente asume que ya está envuelto en un `UserProvider`, por lo que
 * `Navbar` y las rutas anidadas en `<Outlet />` pueden usar el hook `useUser`
 * de forma segura.
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
