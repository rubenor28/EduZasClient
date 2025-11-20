import { Typography, Paper } from "@mui/material";

export const ClasesAsesoradas = () => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h4">Clases Asesoradas</Typography>
      <Typography>
        Contenido de las clases que el profesor está asesorando.
      </Typography>
    </Paper>
  );
};
