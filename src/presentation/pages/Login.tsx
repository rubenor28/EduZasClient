import {
  type FieldErrorDTO,
  apiPostInput,
  NotFoundError,
  errorService,
  InternalServerError,
  apiGet,
  UnauthorizedError,
} from "@application";
import { AuthLayout } from "../layouts/AuthLayout";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

/**
 * Página de inicio de sesión.
 *
 * Responsabilidades:
 * 1. Gestionar el estado del formulario (email, password).
 * 2. Enviar las credenciales a la API (`/auth/login`).
 * 3. Manejar la respuesta:
 *    - Éxito: Redirigir al usuario a la página principal (`/`).
 *    - Error 400 (Input): Mostrar errores de validación en los campos correspondientes.
 *    - Error 409 (Conflict) o 401 (Unauthorized): Mostrar un mensaje de error general.
 * 4. Mostrar mensajes de éxito si se viene de un registro exitoso.
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
    const fetchUser = async () => {
      try {
        await apiGet("/auth/me", {
          parseResponse: "json",
        });

        navigate("/");
      } catch (e) {
        if (e instanceof UnauthorizedError) return;
        throw e;
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (location.state?.registrationSuccess) {
      setSuccessMessage(location.state.message);
      // Limpiar el estado para que el mensaje no se muestre si el usuario navega de nuevo
      // Evita que el mensaje aparezca si el usuario recarga la página o navega a otra y vuelve.
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location]);

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
    setSuccessMessage(null);

    try {
      const result = await apiPostInput<void>("/auth/login", {
        email,
        password,
      });

      result.match(
        (_successData) => {
          navigate("/");
        },
        (error) => {
          if (error.type === "input-error") {
            setFieldErrors(error.data);
          } else if (error.type === "conflict") {
            setFormError(error.message);
          } else {
            setFormError("Las credenciales proporcionadas son incorrectas.");
          }
        },
      );
    } catch (e) {
      if (e instanceof NotFoundError) setFormError("No se encontró el email.");
      else
        errorService.notify(new InternalServerError("Error al iniciar sesión"));
    } finally {
      setIsSubmitting(false);
    }
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
      </Box>
    </AuthLayout>
  );
}
