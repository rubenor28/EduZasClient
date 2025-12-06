import {
  Box,
  TextField,
  Paper,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { SearchType, type ResourceCriteria } from "@application";

type ResourceSearchFormProps = {
  criteria: ResourceCriteria;
  setCriteria: React.Dispatch<React.SetStateAction<ResourceCriteria>>;
  viewSpecificFields?: React.ReactNode;
};

export const ResourceSearchForm = ({
  criteria,
  setCriteria,
  viewSpecificFields,
}: ResourceSearchFormProps) => {
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
          label="Título del contenido"
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
          <ToggleButton value="true">Activos</ToggleButton>
          <ToggleButton value="false">Inactivos</ToggleButton>
          <ToggleButton value="all">Todos</ToggleButton>
        </ToggleButtonGroup>
        {viewSpecificFields}
      </Box>
    </Paper>
  );
};
