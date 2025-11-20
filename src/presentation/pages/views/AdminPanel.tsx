import { Typography, Paper } from "@mui/material";

export const AdminPanel = () => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h4">Panel de Administrador</Typography>
      <Typography>Contenido exclusivo para administradores.</Typography>
    </Paper>
  );
};
