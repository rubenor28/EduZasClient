import {
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import type { FieldErrorDTO } from "@application";
import { useState } from "react";

export type UserFormData = {
  firstName: string;
  midName?: string;
  fatherLastname: string;
  motherLastname?: string;
  email: string;
  password?: string;
  passwordConfirmation?: string;
  role: number;
  active: boolean;
};

/**
 * Props para el formulario de edición de usuarios.
 */
type UserFormProps = {
  /** Datos actuales del formulario. */
  formData: UserFormData;
  /** Manejador de cambios en los campos. */
  onFormChange: (name: string, value: unknown) => void;
  /** Indica si se está en modo edición (afecta validaciones y campos deshabilitados). */
  isEditMode: boolean;
  /** Errores de validación por campo. */
  fieldErrors?: FieldErrorDTO[];
  /** Error de validación para la confirmación de la contraseña. */
  passwordConfirmationError?: string | null;
};

/**
 * Formulario presentacional para la gestión de usuarios (Admin).
 * Incluye campos para datos personales, credenciales y rol.
 */
export const UserEditorForm = ({
  formData,
  onFormChange,
  isEditMode,
  fieldErrors = [],
  passwordConfirmationError,
}: UserFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const getErrorForField = (fieldName: string) =>
    fieldErrors.find(
      (error) => error.field.toLowerCase() === fieldName.toLowerCase(),
    );

  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid item xs={12} sm={6}>
        <TextField
          autoFocus
          name="firstName"
          label="Primer Nombre"
          fullWidth
          variant="outlined"
          value={formData.firstName}
          onChange={(e) => onFormChange(e.target.name, e.target.value)}
          required
          error={!!getErrorForField("firstName")}
          helperText={
            getErrorForField("firstName")?.message || "Mínimo 3 letras."
          }
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          name="midName"
          label="Segundo Nombre"
          fullWidth
          variant="outlined"
          value={formData.midName || ""}
          onChange={(e) => onFormChange(e.target.name, e.target.value)}
          error={!!getErrorForField("midName")}
          helperText={
            getErrorForField("midName")?.message ||
            "Mínimo 3 letras, admite nombres compuestos ej. Del Rocío."
          }
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          name="fatherLastname"
          label="Apellido Paterno"
          fullWidth
          variant="outlined"
          value={formData.fatherLastname}
          onChange={(e) => onFormChange(e.target.name, e.target.value)}
          required
          error={!!getErrorForField("fatherLastname")}
          helperText={
            getErrorForField("fatherLastname")?.message || "Mínimo 3 letras."
          }
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          name="motherLastname"
          label="Apellido Materno"
          fullWidth
          variant="outlined"
          value={formData.motherLastname || ""}
          onChange={(e) => onFormChange(e.target.name, e.target.value)}
          error={!!getErrorForField("motherLastname")}
          helperText={
            getErrorForField("motherLastname")?.message ||
            "Mínimo 3 letras, admite apellidos compuestos ej. Del León"
          }
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          name="email"
          label="Correo Electrónico"
          type="email"
          fullWidth
          variant="outlined"
          value={formData.email}
          onChange={(e) => onFormChange(e.target.name, e.target.value)}
          required
          disabled={isEditMode}
          error={!!getErrorForField("email")}
          helperText={getErrorForField("email")?.message}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          name="password"
          label={isEditMode ? "Nueva Contraseña (opcional)" : "Contraseña"}
          type={showPassword ? "text" : "password"}
          fullWidth
          variant="outlined"
          value={formData.password || ""}
          onChange={(e) => onFormChange(e.target.name, e.target.value)}
          required={!isEditMode}
          error={!!getErrorForField("password")}
          helperText={
            getErrorForField("password")?.message ||
            "Mínimo 8 caracteres, una mayúscula, una minúscula y un símbolo."
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      {(formData.password || !isEditMode) && (
        <Grid item xs={12}>
          <TextField
            name="passwordConfirmation"
            label="Confirmar Contraseña"
            type={showPassword ? "text" : "password"}
            fullWidth
            variant="outlined"
            value={formData.passwordConfirmation || ""}
            onChange={(e) => onFormChange(e.target.name, e.target.value)}
            required={!isEditMode || !!formData.password}
            error={!!passwordConfirmationError}
            helperText={passwordConfirmationError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      )}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Rol</InputLabel>
          <Select
            name="role"
            value={formData.role}
            label="Rol"
            onChange={(e) => onFormChange(e.target.name, e.target.value)}
          >
            <MenuItem value={0}>Estudiante</MenuItem>
            <MenuItem value={1}>Profesor</MenuItem>
            <MenuItem value={2}>Administrador</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      {isEditMode && (
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.active}
                onChange={(e) => onFormChange(e.target.name, e.target.checked)}
                name="active"
              />
            }
            label="Usuario Activo"
          />
        </Grid>
      )}
    </Grid>
  );
};
