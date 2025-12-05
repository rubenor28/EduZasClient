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

type UserFormProps = {
  onSubmit: (payload: NewUser) => Promise<void>;
  isSubmitting: boolean;
  fieldErrors: FieldErrorDTO[];
  formError: string | null;
  submitButtonText: string;
  showLoginLink?: boolean;
};

export const UserForm = ({
  onSubmit,
  isSubmitting,
  fieldErrors,
  formError,
  submitButtonText,
  showLoginLink = false,
}: UserFormProps) => {
  const [formState, setFormState] = useState<NewUser>({
    firstName: "",
    midName: "",
    fatherLastname: "",
    motherLastname: "",
    email: "",
    password: "",
    role: 0
  });

  const [showPassword, setShowPassword] = useState(false);

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
    const payload: NewUser = { ...formState };
    if (payload.motherLastname === "") {
      delete payload.motherLastname;
    }
    if (payload.midName === "") {
      delete payload.midName;
    }
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
        helperText={getErrorForField("firstName")?.message}
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
        helperText={getErrorForField("midName")?.message}
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
        helperText={getErrorForField("fatherLastname")?.message}
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
        helperText={getErrorForField("motherLastname")?.message}
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
        helperText={getErrorForField("password")?.message}
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
