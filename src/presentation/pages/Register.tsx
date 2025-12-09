import { type FieldErrorDTO, apiPostInput, type NewUser } from "@application";
import { AuthLayout } from "../layouts/AuthLayout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserForm } from "../components/forms/UserForm";
import { Snackbar, Alert } from "@mui/material";

/**
 * Página de registro de nuevos usuarios (Self-Service).
 *
 * Reutiliza el componente `UserForm` para la interfaz, pero inyecta la lógica específica
 * para el endpoint de registro público (`/auth/sign-in`).
 *
 * Flujo:
 * 1. El usuario completa el formulario.
 * 2. Se envía la petición POST a `/auth/sign-in`.
 * 3. Si es exitoso, muestra un Snackbar y redirige al Login tras 2 segundos.
 */
export function Register() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrorDTO[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSubmit = async (payload: Partial<NewUser>) => {
    setIsSubmitting(true);
    setFieldErrors([]);
    setFormError(null);

    const result = await apiPostInput<unknown>("/auth/sign-in", payload);

    setIsSubmitting(false);
    result.match(
      () => {
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate("/login", {
            state: {
              registrationSuccess: true,
              message: "¡Registro exitoso! Por favor, inicia sesión.",
            },
          });
        }, 2000);
      },
      (error) => {
        if (error.type === "input-error") {
          setFieldErrors(error.data);
        } else if (error.type === "conflict") {
          setFormError(error.message);
        } else {
          setFormError(
            "Ocurrió un error inesperado al intentar registrar la cuenta.",
          );
        }
      },
    );
  };

  return (
    <AuthLayout title="Crear Cuenta">
      <UserForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        fieldErrors={fieldErrors}
        formError={formError}
        submitButtonText="Registrarse"
        showLoginLink={true}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          ¡Registro exitoso! Redirigiendo al login...
        </Alert>
      </Snackbar>
    </AuthLayout>
  );
}
