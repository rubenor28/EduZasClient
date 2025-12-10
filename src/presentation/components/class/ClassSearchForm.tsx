import {
  Box,
  TextField,
  Paper,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { SearchType, type StringQuery, type Criteria } from "@application";

/**
 * Props para el formulario de búsqueda de clases.
 */
type ClassSearchFormProps<T extends Criteria & { active?: boolean; className?: StringQuery; subject?: StringQuery; section?: StringQuery; }> = {
  /** Estado actual de los criterios de búsqueda. */
  criteria: T;
  /** Función para actualizar los criterios. */
  setCriteria: React.Dispatch<React.SetStateAction<T>>;
};

/**
 * Formulario reutilizable para filtrar clases.
 * Permite buscar por nombre, asignatura y estado (activas/inactivas).
 */
export const ClassSearchForm = <T extends Criteria & { active?: boolean; className?: StringQuery; subject?: StringQuery; section?: StringQuery; }>({
  criteria,
  setCriteria,
}: ClassSearchFormProps<T>) => {
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
      </Box>
    </Paper>
  );
};
