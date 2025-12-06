import {
  Box,
  TextField,
  Paper,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { SearchType, type ClassCriteria } from "@application";

type ClassSearchFormProps = {
  criteria: ClassCriteria;
  setCriteria: React.Dispatch<React.SetStateAction<ClassCriteria>>;
  viewSpecificFields?: React.ReactNode;
};

export const ClassSearchForm = ({
  criteria,
  setCriteria,
  viewSpecificFields,
}: ClassSearchFormProps) => {
  const handleStringChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCriteria((prev) => ({
      ...prev,
      [name]: value ? { text: value, searchType: SearchType.LIKE } : undefined,
    }));
  };

  const handleActiveChange = (
    _e: React.MouseEvent<HTMLElement>,
    newValue: string | null,
  ) => {
    if (newValue === null) return; // No permitir deselección total
    setCriteria((prev) => ({
      ...prev,
      active:
        newValue === "all"
          ? undefined
          : newValue === "true"
          ? true
          : false,
    }));
  };

  const activeValue =
    criteria.active === undefined
      ? "all"
      : criteria.active
      ? "true"
      : "false";

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Filtros de Búsqueda
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        <TextField
          label="Nombre de la clase"
          name="className"
          value={criteria.className?.text || ""}
          onChange={handleStringChange}
          variant="outlined"
          size="small"
        />
        <TextField
          label="Asignatura"
          name="subject"
          value={criteria.subject?.text || ""}
          onChange={handleStringChange}
          variant="outlined"
          size="small"
        />
        <ToggleButtonGroup
          value={activeValue}
          exclusive
          onChange={handleActiveChange}
          size="small"
        >
          <ToggleButton value="true">Activas</ToggleButton>
          <ToggleButton value="false">Inactivas</ToggleButton>
          <ToggleButton value="all">Todas</ToggleButton>
        </ToggleButtonGroup>
        {viewSpecificFields}
      </Box>
    </Paper>
  );
};
