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
import { useNavigate } from "react-router-dom";

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
  // Futuras acciones del administrador pueden ir aquí
];

/**
 * Panel principal para usuarios con rol de Administrador.
 * Muestra un grid de tarjetas con accesos directos a las funciones administrativas
 * (gestión de base de datos, usuarios, etc.).
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
