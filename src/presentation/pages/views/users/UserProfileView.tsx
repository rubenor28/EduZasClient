import {
  apiPut,
  InputError,
  type FieldErrorDTO,
  type UpdateUser,
} from "@application";
import type { User } from "@domain";
import { useState } from "react";
import { UserProfileForm } from "./UserProfileForm";
import { Box, Button, Paper, Typography } from "@mui/material";
import { Snackbar, Alert } from "@mui/material";
import { useUser } from "@presentation";
import { useNavigate } from "react-router";

type SnackbarState =
  | { open: false }
  | { open: true; severity: "success" | "error"; message: string };

export function UserProfileView() {
  const toUserUpdate = ({
    id,
    active,
    role,
    email,
    firstName,
    midName,
    fatherLastname,
    motherLastname,
  }: User): UpdateUser => ({
    id,
    active,
    role,
    email,
    firstName,
    midName,
    fatherLastname,
    motherLastname,
    password: null,
  });

  const navigate = useNavigate();
  const { user } = useUser();
  const [formData, setFormData] = useState<UpdateUser>(toUserUpdate(user));
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrorDTO[] | undefined>();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    open: false,
  });

  const handleSubmit = async () => {
    setFieldErrors([]);

    try {
      setIsSubmitting(true);
      const user = await apiPut<User>("/users", toUserUpdate(formData!));
      setFormData(toUserUpdate(user));
      setSnackbarState({
        open: true,
        message: "Se actualizó tu informacción correctamente",
        severity: "success",
      });
      setIsEditing(false);
    } catch (e) {
      if (e instanceof InputError) {
        setFieldErrors(e.errors);
      } else {
        const message =
          e instanceof Error
            ? e.message
            : "Ocurrio un error al actualizar el usuario";
        setSnackbarState({
          open: true,
          message,
          severity: "error",
        });
      }
    } finally {
      setIsSubmitting(false);
      setIsEditing(false);
    }
  };

  const onInputChange = (field: string, value: unknown) => {
    setFormData((prevState) => ({
      ...prevState!,
      [field]: value === "" ? undefined : value,
    }));
  };

  return (
    <Paper sx={{ p: 3, backgroundColor: "transparent", boxShadow: "none" }}>
      <Typography variant="h2" gutterBottom>
        Mi perfil
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "left",
          mb: 2,
        }}
      >
        <Button onClick={() => navigate(-1)} variant="outlined" sx={{ mr: 2 }}>
          Volver
        </Button>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant="outlined"
          disabled={isEditing}
          sx={{ mr: 2 }}
        >
          Editar
        </Button>
      </Box>
      <UserProfileForm
        formData={formData!}
        isEditting={isEditing}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        fieldErrors={fieldErrors}
        onInputChange={onInputChange}
      />
      {snackbarState.open && (
        <Snackbar
          open={true}
          autoHideDuration={4000}
          onClose={() => setSnackbarState({ open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbarState({ open: false })}
            severity={snackbarState.severity}
            sx={{ width: "100%" }}
          >
            {snackbarState.message}
          </Alert>
        </Snackbar>
      )}
    </Paper>
  );
}
