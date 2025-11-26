import { Typography, Paper } from "@mui/material";
import { ResourceEditor } from "@presentation";

export const ContenidoAcademico = () => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h4">Contenido Académico</Typography>
      <Typography>Contenido académico disponible.</Typography>
      <ResourceEditor />
    </Paper>
  );
};
