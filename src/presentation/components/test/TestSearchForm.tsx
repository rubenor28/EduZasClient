import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
} from "@mui/material";
import { SearchType, type TestCriteria } from "@application";
import type { Dispatch, SetStateAction } from "react";

/**
 * Props para el componente {@link TestSearchForm}.
 */
type TestSearchFormProps = {
  /** Objeto que contiene los criterios de búsqueda actuales. */
  criteria: TestCriteria;
  /** Función para actualizar los criterios de búsqueda. */
  setCriteria: Dispatch<SetStateAction<TestCriteria>>;
};

/**
 * Formulario de búsqueda para filtrar exámenes.
 *
 * Permite buscar exámenes por título y filtrar por su estado (activos, archivados o todos).
 * @param props - Las propiedades del componente.
 */
export const TestSearchForm = ({
  criteria,
  setCriteria,
}: TestSearchFormProps) => {
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCriteria((prev) => ({
      ...prev,
      page: 1,
      title: event.target.value
        ? { text: event.target.value, searchType: SearchType.LIKE }
        : undefined,
    }));
  };

  const handleActiveChange = (value: string) => {
    setCriteria((prev) => ({
      ...prev,
      page: 1,
      active: value === "all" ? undefined : value === "true",
    }));
  };

  return (
    <Box component="form" noValidate autoComplete="off" sx={{ mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={8}>
          <TextField
            label="Buscar por Título"
            variant="outlined"
            fullWidth
            value={criteria.title?.text || ""}
            onChange={handleTitleChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Estado</InputLabel>
            <Select
              value={
                criteria.active === undefined
                  ? "all"
                  : criteria.active
                  ? "true"
                  : "false"
              }
              onChange={(e) => handleActiveChange(e.target.value)}
              label="Estado"
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="true">Activos</MenuItem>
              <MenuItem value="false">Archivados</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};
