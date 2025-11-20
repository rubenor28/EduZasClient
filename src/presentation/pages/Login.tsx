import {
  type FieldErrorDTO,
  InternalServerError,
  apiClient,
} from "@application";
import { AuthLayout } from "../layouts/AuthLayout";
import { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink, useLocation } from "react-router-dom";
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

/**
 * Página de inicio de sesión de usuario.
 * Utiliza el AuthLayout para la presentación y se centra en la lógica del formulario.
 */
export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<FieldErrorDTO[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.registrationSuccess) {
      setSuccessMessage(location.state.message);
      // Limpiar el estado para que el mensaje no se muestre si el usuario navega de nuevo
      // Esto es crucial para evitar que el mensaje aparezca si el usuario recarga la página o navega a otra y vuelve.
      window.history.replaceState({}, document.title, location.pathname);
    }

    const isAlreadyAuth = async () => {
      let result = await apiClient.auth.getMe();

      if (result.ok) {
        navigate("/");
        return;
      }
    };

    isAlreadyAuth();
  }, [location]); // Dependencia solo en location para evitar bucles. location.state ya es un nuevo objeto en cada navegación.

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const getErrorForField = (fieldName: string) => {
    return fieldErrors.find((error) => error.field === fieldName);
  };

  const emailError = getErrorForField("email");
  const passwordError = getErrorForField("password");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFieldErrors([]);
    setFormError(null);
    setSuccessMessage(null); // Clear success message on new submission

    const result = await apiClient.inputHandle.post<void>("/auth/login", {
      email,
      password,
    });

    setIsSubmitting(false);
    result.match(
      (_successData) => {
        navigate("/");
      },
      (error) => {
        if (error.type === "input-error") {
          setFieldErrors(error.data);
        } else if (error.type === "already-exists") {
          throw new InternalServerError(
            "Error inesperado: 'already-exists' recibido en el login.",
          );
        } else {
          setFormError("Las credenciales proporcionadas son incorrectas.");
        }
      },
    );
  };

  return (
    <AuthLayout title="Iniciar Sesión">
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ mt: 1, width: "100%" }}
      >
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2, width: "100%" }}>
            {successMessage}
          </Alert>
        )}
        {formError && (
          <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
            {formError}
          </Alert>
        )}
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Correo Electrónico"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!emailError}
          helperText={emailError?.message}
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
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!passwordError}
          helperText={passwordError?.message}
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
            "Iniciar Sesión"
          )}
        </Button>
        <Link component={RouterLink} to="/register" variant="body2">
          {"¿No tienes una cuenta? Regístrate aquí"}
        </Link>
      </Box>
    </AuthLayout>
  );
}
