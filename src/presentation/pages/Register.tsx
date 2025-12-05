import { type FieldErrorDTO, apiPostInput, type NewUser } from "@application";
import { AuthLayout } from "../layouts/AuthLayout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserForm } from "../components/forms/UserForm";
import { Snackbar, Alert } from "@mui/material";

/**
 * Página de registro de nuevos usuarios.
 * Utiliza el componente reutilizable UserForm y le proporciona la lógica
 * específica para el endpoint de auto-registro.
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
        } else if (error.type === "already-exists") {
          setFormError("El correo electrónico ya está en uso.");
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
