import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { useUser } from "../../context/UserContext";
import type { User } from "@domain";
import { apiDelete } from "@application";
import { useNavigate, NavLink } from "react-router-dom";
import { NotificationBell } from "../notifications/NotificationBell";

type NavPage = {
  title: string;
  path: string;
  minimumRole: number;
};

/**
 * Barra de navegación superior.
 *
 * Responsabilidades:
 * 1. Mostrar el nombre del usuario autenticado.
 * 2. Renderizar enlaces de navegación basados en el rol del usuario.
 * 3. Proveer la funcionalidad de Cerrar Sesión.
 */
export const Navbar = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const navPages: NavPage[] = [
    { title: "Panel de Administrador", path: "/admin", minimumRole: 2 },
    { title: "Panel de Profesor", path: "/professor", minimumRole: 1 },
    { title: "Panel de Estudiante", path: "/student", minimumRole: 0 }
  ];

  const handleLogout = async () => {
    await apiDelete("/auth/logout", { parseResponse: 'void' });
    navigate("/login");
  };

  const getDisplayName = (user: User) =>
    user.midName ? `${user.firstName} ${user.midName}` : user.firstName;

  // Estilo para el NavLink activo
  const activeLinkStyle = {
    textDecoration: "underline",
    fontWeight: "bold",
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "primary.main" }}>
      <Toolbar>
        <Typography variant="h6" component="div">
          ¡Hola {getDisplayName(user)}!
        </Typography>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {/* 3. Filtrar páginas y usar NavLink */}
          {navPages
            .filter((page) => user.role >= page.minimumRole)
            .map((page) => (
              <NavLink
                key={page.title}
                to={page.path}
                style={({ isActive }) => ({
                  ...(isActive ? activeLinkStyle : {}),
                  color: "white",
                  textDecoration: "none",
                  margin: "0 16px",
                  padding: "8px 0",
                })}
              >
                {page.title}
              </NavLink>
            ))}
        </Box>
        <NotificationBell />
        <Typography
          onClick={handleLogout}
          sx={{ cursor: "pointer", color: "inherit", ml: 2 }}
        >
          Cerrar Sesión
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
