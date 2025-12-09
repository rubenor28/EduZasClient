import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import type { FieldErrorDTO, NewUser } from "@application";

/**
 * Props para el componente UserForm.
 */
type UserFormProps = {
  /** Función a ejecutar al enviar el formulario. */
  onSubmit: (payload: NewUser) => Promise<void>;
  /** Indica si el formulario se está enviando (deshabilita inputs). */
  isSubmitting: boolean;
  /** Lista de errores de validación por campo. */
  fieldErrors: FieldErrorDTO[];
  /** Error general del formulario (no asociado a un campo específico). */
  formError: string | null;
  /** Texto del botón de envío (ej. "Registrarse", "Crear Admin"). */
  submitButtonText: string;
  /** Si es true, muestra un enlace para ir al Login. */
  showLoginLink?: boolean;
};

type UserFormData = NewUser & {
  passwordConfirmation?: string;
};

/**
 * Formulario reutilizable para la creación de usuarios.
 * Se utiliza tanto en el Registro Público como en la Configuración Inicial.
 *
 * Maneja internamente el estado de los campos y la visibilidad de la contraseña.
 */
export const UserForm = ({
  onSubmit,
  isSubmitting,
  fieldErrors,
  formError,
  submitButtonText,
  showLoginLink = false,
}: UserFormProps) => {
  const [formState, setFormState] = useState<UserFormData>({
    firstName: "",
    midName: "",
    fatherLastname: "",
    motherLastname: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    role: 0,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordConfirmationError, setPasswordConfirmationError] = useState<
    string | null
  >(null);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const getErrorForField = (fieldName: string) => {
    return fieldErrors.find(
      (error) => error.field.toLowerCase() === fieldName.toLowerCase(),
    );
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formState.password !== formState.passwordConfirmation) {
      setPasswordConfirmationError("Las contraseñas no coinciden");
      return;
    }
    setPasswordConfirmationError(null);

    const payload: NewUser = { ...formState };
    if (payload.motherLastname === "") {
      delete payload.motherLastname;
    }
    if (payload.midName === "") {
      delete payload.midName;
    }
    delete (payload as Partial<UserFormData>).passwordConfirmation;
    onSubmit(payload);
  };

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit}
      sx={{ mt: 1, width: "100%" }}
    >
      {formError && (
        <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
          {formError}
        </Alert>
      )}
      <TextField
        margin="normal"
        required
        fullWidth
        id="firstName"
        label="Primer Nombre"
        name="firstName"
        autoComplete="given-name"
        autoFocus
        value={formState.firstName}
        onChange={handleInputChange}
        error={!!getErrorForField("firstName")}
        helperText={
          getErrorForField("firstName")?.message || "Mínimo 3 letras."
        }
        disabled={isSubmitting}
      />
      <TextField
        margin="normal"
        fullWidth
        id="midName"
        label="Segundo Nombre"
        name="midName"
        autoComplete="additional-name"
        value={formState.midName}
        onChange={handleInputChange}
        error={!!getErrorForField("midName")}
        helperText={
          getErrorForField("midName")?.message ||
          "Mínimo 3 letras, admite nombres compuestos ej. Del Rocío."
        }
        disabled={isSubmitting}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="fatherLastname"
        label="Apellido Paterno"
        name="fatherLastname"
        autoComplete="family-name"
        value={formState.fatherLastname}
        onChange={handleInputChange}
        error={!!getErrorForField("fatherLastname")}
        helperText={
          getErrorForField("fatherLastname")?.message || "Mínimo 3 letras."
        }
        disabled={isSubmitting}
      />
      <TextField
        margin="normal"
        fullWidth
        id="motherLastname"
        label="Apellido Materno"
        name="motherLastname"
        autoComplete="additional-name"
        value={formState.motherLastname}
        onChange={handleInputChange}
        error={!!getErrorForField("motherLastname")}
        helperText={
          getErrorForField("motherLastname")?.message ||
          "Mínimo 3 letras, admite apellidos compuestos ej. Del León"
        }
        disabled={isSubmitting}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Correo Electrónico"
        name="email"
        autoComplete="email"
        value={formState.email}
        onChange={handleInputChange}
        error={!!getErrorForField("email")}
        helperText={getErrorForField("email")?.message}
        disabled={isSubmitting}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Contraseña"
        type={showPassword ? "text" : "password"}
        id="password"
        autoComplete="new-password"
        value={formState.password}
        onChange={handleInputChange}
        error={!!getErrorForField("password")}
        helperText={
          getErrorForField("password")?.message ||
          "Mínimo 8 caracteres, una mayúscula, una minúscula y un símbolo."
        }
        disabled={isSubmitting}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="passwordConfirmation"
        label="Confirmar Contraseña"
        type={showPassword ? "text" : "password"} // Use showPassword for consistency
        id="passwordConfirmation"
        autoComplete="new-password"
        value={formState.passwordConfirmation}
        onChange={handleInputChange}
        error={!!passwordConfirmationError}
        helperText={passwordConfirmationError}
        disabled={isSubmitting}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password confirmation visibility"
                onClick={handleClickShowPassword} // Reuse the same handler as password
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2, height: 40 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          submitButtonText
        )}
      </Button>
      {showLoginLink && (
        <Link component={RouterLink} to="/login" variant="body2">
          {"¿Ya tienes una cuenta? Inicia sesión aquí"}
        </Link>
      )}
    </Box>
  );
};
