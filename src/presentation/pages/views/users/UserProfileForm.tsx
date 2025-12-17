import type { FieldErrorDTO, UpdateUser } from "@application";
import { Button, CircularProgress, Grid, TextField } from "@mui/material";
import { getFieldError } from "@application";

export type UserFormProps = {
  isEditting: boolean;
  formData: UpdateUser;
  onInputChange: (field: string, value: unknown) => void;
  fieldErrors: FieldErrorDTO[] | undefined;
  isSubmitting: boolean;
  onSubmit: () => Promise<void>;
};

export function UserProfileForm({
  isEditting,
  formData,
  onInputChange,
  fieldErrors,
  isSubmitting,
  onSubmit,
}: UserFormProps) {
  const firsNameError = getFieldError("firstName", fieldErrors);
  const midNameError = getFieldError("midName", fieldErrors);
  const fatherLastnameError = getFieldError("fatherLastname", fieldErrors);
  const motherLastnameError = getFieldError("motherLastname", fieldErrors);
  const emailError = getFieldError("email", fieldErrors);

  return (
    <>
      <Grid item xs={12}>
        <TextField
          name="email"
          label="Correo Electrónico"
          type="email"
          fullWidth
          variant="outlined"
          value={formData.email}
          required
          disabled={true}
          error={!!emailError}
          helperText={emailError?.message}
        />
      </Grid>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            autoFocus
            name="firstName"
            label="Primer Nombre"
            fullWidth
            variant="outlined"
            disabled={!isEditting}
            value={formData.firstName}
            onChange={(e) => onInputChange(e.target.name, e.target.value)}
            required
            error={!!firsNameError}
            helperText={firsNameError?.message || "Mínimo 3 letras."}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="midName"
            label="Segundo Nombre"
            fullWidth
            disabled={!isEditting}
            variant="outlined"
            value={formData.midName || ""}
            onChange={(e) => onInputChange(e.target.name, e.target.value)}
            error={!!midNameError}
            helperText={
              midNameError?.message ||
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
            disabled={!isEditting}
            value={formData.fatherLastname}
            onChange={(e) => onInputChange(e.target.name, e.target.value)}
            required
            error={!!fatherLastnameError}
            helperText={fatherLastnameError?.message || "Mínimo 3 letras."}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="motherLastname"
            label="Apellido Materno"
            fullWidth
            variant="outlined"
            disabled={!isEditting}
            value={formData.motherLastname || ""}
            onChange={(e) => onInputChange(e.target.name, e.target.value)}
            error={!!motherLastnameError}
            helperText={
              motherLastnameError?.message ||
              "Mínimo 3 letras, admite apellidos compuestos ej. Del León"
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            onClick={onSubmit}
            variant="contained"
            disabled={!isEditting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Guardar"}
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
