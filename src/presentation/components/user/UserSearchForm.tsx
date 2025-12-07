import {
  Box,
  TextField,
  Paper,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { SearchType, type UserCriteria } from "@application";

type UserSearchFormProps = {
  criteria: UserCriteria;
  setCriteria: React.Dispatch<React.SetStateAction<UserCriteria>>;
};

export const UserSearchForm = ({
  criteria,
  setCriteria,
}: UserSearchFormProps) => {
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

  const handleRoleChange = (e: any) => {
    const { value } = e.target;
    setCriteria((prev) => ({
      ...prev,
      role: value === "all" ? undefined : Number(value),
    }));
  };

  const activeValue =
    criteria.active === undefined
      ? "all"
      : criteria.active
      ? "true"
      : "false";

  const roleValue = criteria.role === undefined ? "all" : criteria.role;

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Filtros de Búsqueda
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        <TextField
          label="Nombre"
          name="firstName"
          value={criteria.firstName?.text || ""}
          onChange={handleStringChange}
          variant="outlined"
          size="small"
        />
        <TextField
          label="Apellido"
          name="fatherLastname"
          value={criteria.fatherLastname?.text || ""}
          onChange={handleStringChange}
          variant="outlined"
          size="small"
        />
        <TextField
          label="Email"
          name="email"
          value={criteria.email?.text || ""}
          onChange={handleStringChange}
          variant="outlined"
          size="small"
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Rol</InputLabel>
          <Select
            value={roleValue}
            label="Rol"
            name="role"
            onChange={handleRoleChange}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value={0}>Estudiante</MenuItem>
            <MenuItem value={1}>Profesor</MenuItem>
            <MenuItem value={2}>Admin</MenuItem>
          </Select>
        </FormControl>
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
      </Box>
    </Paper>
  );
};
