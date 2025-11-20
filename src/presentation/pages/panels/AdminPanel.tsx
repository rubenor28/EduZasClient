import { Paper, Typography } from "@mui/material";

export const AdminPanel = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Administrador
      </Typography>
      <Typography>
        Bienvenido, administrador. Desde aquí puedes gestionar el sistema.
      </Typography>
      {/* Próximamente: Grids con tarjetas de acción como en los otros paneles */}
    </Paper>
  );
};
