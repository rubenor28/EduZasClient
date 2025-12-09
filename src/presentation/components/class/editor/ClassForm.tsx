import { TextField, Box, Paper, Typography, Grid } from "@mui/material";
import type { NewClass, ClassUpdate, FieldErrorDTO } from "@application";

// Colores predefinidos para el selector
const PREDEFINED_COLORS = [
  "#2E7D32", "#1565C0", "#C62828", "#4527A0",
  "#D84315", "#00695C", "#AD1457", "#6A1B9A",
];

// Tipo que puede ser para una nueva clase o para una actualización
export type ClassFormData = Omit<NewClass & ClassUpdate, "ownerId" | "id">;

/**
 * Props para el formulario de datos de la clase.
 */
type ClassFormProps = {
  /** Datos actuales del formulario. */
  formData: ClassFormData;
  /** Manejador de cambios en inputs de texto. */
  onFormChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  /** Manejador de cambio de color. */
  onColorChange: (color: string) => void;
  /** Errores de validación por campo. */
  fieldErrors?: FieldErrorDTO[];
};

/**
 * Formulario presentacional para editar los detalles de una clase.
 * Incluye campos para nombre, asignatura, sección y un selector de color.
 */
export const ClassForm = ({
  formData,
  onFormChange,
  onColorChange,
  fieldErrors = [],
}: ClassFormProps) => {
  const getErrorForField = (fieldName: string) =>
    fieldErrors.find((error) => error.field.toLowerCase() === fieldName.toLowerCase());

  const classNameError = getErrorForField("className");
  const subjectError = getErrorForField("subject");
  const sectionError = getErrorForField("section");
  const colorError = getErrorForField("color");

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          autoFocus
          margin="dense"
          name="className"
          label="Nombre de la clase"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.className}
          onChange={onFormChange}
          required
          error={!!classNameError}
          helperText={classNameError?.message}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          margin="dense"
          name="subject"
          label="Asignatura (opcional)"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.subject || ""}
          onChange={onFormChange}
          error={!!subjectError}
          helperText={subjectError?.message}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          margin="dense"
          name="section"
          label="Sección (opcional)"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.section || ""}
          onChange={onFormChange}
          error={!!sectionError}
          helperText={sectionError?.message}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 1 }}>
          Color de la tarjeta
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {PREDEFINED_COLORS.map((color) => (
            <Paper
              key={color}
              onClick={() => onColorChange(color)}
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: color,
                cursor: "pointer",
                border:
                  formData.color === color
                    ? "3px solid #90caf9" // Borde azul claro para el color seleccionado
                    : "3px solid transparent",
                transition: "border 0.2s",
              }}
            />
          ))}
        </Box>
        {colorError && (
          <Typography color="error" variant="caption" sx={{ mt: 1 }}>
            {colorError.message}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};
