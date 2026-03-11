import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";
import DnsIcon from '@mui/icons-material/Dns';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useNavigate } from "react-router-dom";

/**
 * Definición de las acciones administrativas disponibles en el panel.
 */
const actions = [
  {
    title: "Gestión de Base de Datos",
    description: "Realiza respaldos y restauraciones de la base de datos del sistema.",
    icon: <DnsIcon fontSize="large" />,
    path: "/admin/database",
  },
  {
    title: "Gestión de Usuarios",
    description: "Administra los usuarios del sistema, sus roles y estados.",
    icon: <PeopleIcon fontSize="large" />,
    path: "/admin/users",
  },
  {
    title: "Gestión de Clases",
    description: "Administra las clases dentro del sistema.",
    icon: <SchoolIcon fontSize="large" />,
    path: "/admin/classes",
  },
  {
    title: "Gestión de Contenido Académico",
    description: "Administra todo el contenido académico (recursos) del sistema.",
    icon: <MenuBookIcon fontSize="large" />,
    path: "/admin/resources",
  }
];

/**
 * Panel de control para el rol de Administrador.
 * 
 * Presenta una interfaz de tablero (dashboard) con acceso directo a las funciones
 * críticas del sistema, como la gestión de datos, usuarios y contenido global.
 */
export const AdminPanel = () => {
  const navigate = useNavigate();

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Administrador
      </Typography>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {actions.map((action) => (
          <Grid item xs={12} md={6} lg={4} key={action.title}>
            <Card>
              <CardActionArea
                onClick={() => navigate(action.path)}
                sx={{ display: "flex", p: 2, alignItems: "center" }}
              >
                <Box sx={{ mr: 2, color: "primary.main" }}>{action.icon}</Box>
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6" component="div">
                    {action.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {action.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};
