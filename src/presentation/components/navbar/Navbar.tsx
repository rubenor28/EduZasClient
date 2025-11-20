import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { useUser } from "../../context/UserContext";
import type { User } from "@domain";
import { apiDelete } from "@application";
import { useNavigate, NavLink } from "react-router-dom";

type NavPage = {
  title: string;
  path: string;
  minimumRole: number;
};

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
        <Typography
          onClick={handleLogout}
          sx={{ cursor: "pointer", color: "inherit" }}
        >
          Cerrar Sesión
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
