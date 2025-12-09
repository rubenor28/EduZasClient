import {
  Box,
  TextField,
  Paper,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { SearchType, type TestCriteria } from "@application";

/**
 * Props para el componente TestSearchForm.
 */
type TestSearchFormProps = {
  /** Criterios de búsqueda actuales. */
  criteria: TestCriteria;
  /** Función para actualizar los criterios de búsqueda. */
  setCriteria: React.Dispatch<React.SetStateAction<TestCriteria>>;
};

/**
 * Un componente de formulario para buscar y filtrar evaluaciones.
 */
export const TestSearchForm = ({
  criteria,
  setCriteria,
}: TestSearchFormProps) => {
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
    if (newValue === null) return;
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
          label="Título"
          name="title"
          value={criteria.title?.text || ""}
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
      </Box>
    </Paper>
  );
};
