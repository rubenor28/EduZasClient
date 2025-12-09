import { type FieldErrorDTO, apiPostInput, type NewUser } from "@application";
import { AuthLayout } from "@presentation";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserForm } from "../components/forms/UserForm";
import { Snackbar, Alert } from "@mui/material";

/**
 * Página de configuración inicial (First Run).
 *
 * Se muestra solo cuando el sistema detecta que no existen usuarios en la base de datos.
 * Permite crear la primera cuenta de Administrador sin necesidad de autenticación previa.
 * Utiliza el endpoint especial `/auth/first-user`.
 */
export function InitialSetup() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrorDTO[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSubmit = async (payload: NewUser) => {
    setIsSubmitting(true);
    setFieldErrors([]);
    setFormError(null);

    try {
      const result = await apiPostInput<unknown>("/auth/first-user", payload);

      result.match(
        () => {
          setSnackbarMessage(
            "¡Primer administrador registrado! Redirigiendo al login...",
          );
          setSnackbarOpen(true);
          setTimeout(() => {
            navigate("/login", {
              state: {
                registrationSuccess: true,
                message:
                  "¡Primer administrador registrado! Por favor, inicia sesión.",
              },
            });
          }, 2000);
        },
        (error) => {
          if (error.type === "input-error") {
            setFieldErrors(error.data);
          } else {
            setFormError(
              "Ocurrió un error inesperado al intentar registrar la cuenta.",
            );
          }
        },
      );
    } catch {
      setFormError(
        "Ocurrió un error inesperado al intentar registrar la cuenta.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Configuración Inicial del Sistema">
      <UserForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        fieldErrors={fieldErrors}
        formError={formError}
        submitButtonText="Crear Primer Administrador"
        showLoginLink={false}
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
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </AuthLayout>
  );
}
