import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Paper,
} from "@mui/material";
import {
  type FieldErrorDTO,
  InternalServerError,
  apiClient,
} from "@application";

/**
 * Página de inicio de sesión de usuario con diseño de dos columnas.
 */
export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<FieldErrorDTO[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

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

    const result = await apiClient.inputHandle.post<{ token: string }>(
      "/auth/login",
      { email, password },
    );

    setIsSubmitting(false);
    result.match(
      (_successData) => {
        // En un caso real, guardaríamos el token en el estado global/localStorage
        navigate("/");
      },
      (error) => {
        // Manejamos los diferentes tipos de error que `inputHandle` nos puede devolver
        if (error.type === "input-error") {
          setFieldErrors(error.data);
        } else if (error.type === "already-exists") {
          // Como pediste, lanzamos una excepción para que el manejador global la capture
          throw new InternalServerError(
            "Error inesperado: 'already-exists' recibido en el login.",
          );
        } else {
          // Para otros errores que no son de validación de campos pero que no lanzaron excepción
          setFormError("Las credenciales proporcionadas son incorrectas.");
        }
      },
    );
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      {/* Columna del Formulario */}
      <Grid xs={12} sm={8} md={5}>
        <Paper
          elevation={6}
          square
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "100%",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Iniciar Sesión
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
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
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!passwordError}
                helperText={passwordError?.message}
                disabled={isSubmitting}
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
          </Box>
        </Paper>
      </Grid>
      {/* Columna de la Imagen */}
      <Grid
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: "url(/login-background.png)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </Grid>
  );
}
