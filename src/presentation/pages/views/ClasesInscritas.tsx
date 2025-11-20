import { Typography, Paper } from "@mui/material";

export const ClasesInscritas = () => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h4">Clases Inscritas</Typography>
      <Typography>
        Contenido de las clases en las que el alumno está inscrito.
      </Typography>
    </Paper>
  );
};
