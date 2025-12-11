import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import { UserEditorForm, type UserFormData } from "./UserEditorForm";
import type { User } from "@domain";
import type { NewUser, UpdateUser, FieldErrorDTO } from "@application";
import { apiPost, apiPut, Conflict, InputError } from "@application";

/**
 * Props para el modal de gestión de usuarios.
 */
type UserEditorModalProps = {
  /** Controla la visibilidad del modal. */
  open: boolean;
  /** Función para cerrar el modal. */
  onClose: () => void;
  /** Usuario a editar (null para crear). */
  userToEdit?: User | null;
  /** Callback tras operación exitosa. */
  onSuccess: () => void;
};

type FormPayload =
  | { mode: "create"; data: NewUser }
  | { mode: "update"; data: UpdateUser };

const getInitialFormData = (user?: User | null): UserFormData => ({
  firstName: user?.firstName || "",
  midName: user?.midName || "",
  fatherLastname: user?.fatherLastname || "",
  motherLastname: user?.motherLastname || "",
  email: user?.email || "",
  password: "",
  passwordConfirmation: "",
  role: user?.role ?? 0,
  active: user ? user.active : true,
});

/**
 * Modal contenedor para crear o editar usuarios (Admin).
 * Gestiona la lógica de negocio, llamadas a API y transformación de datos
 * antes de pasarlos al `UserEditorForm`.
 */
export const UserEditorModal = ({
  open,
  onClose,
  userToEdit,
  onSuccess,
}: UserEditorModalProps) => {
  const [formData, setFormData] = useState<UserFormData>(
    getInitialFormData(userToEdit),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrorDTO[]>([]);
  const [passwordConfirmationError, setPasswordConfirmationError] = useState<
    string | null
  >(null);

  const isEditMode = !!userToEdit;

  useEffect(() => {
    if (open) {
      setFormData(getInitialFormData(userToEdit));
      setFormError(null);
      setFieldErrors([]);
      setPasswordConfirmationError(null);
    }
  }, [userToEdit, open]);

  const handleFormChange = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFormError(null);
    setFieldErrors([]);
    setPasswordConfirmationError(null);

    // Validar confirmación de contraseña si se está estableciendo una
    if (formData.password) {
      if (formData.password !== formData.passwordConfirmation) {
        setPasswordConfirmationError("Las contraseñas no coinciden.");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      let formPayload: FormPayload;

      if (isEditMode) {
        const updateData: UpdateUser = {
          id: userToEdit!.id,
          firstName: formData.firstName,
          fatherLastname: formData.fatherLastname,
          email: formData.email,
          role: formData.role,
          active: formData.active,
          password: formData.password || null,
        };
        if (formData.midName) updateData.midName = formData.midName;
        if (formData.motherLastname)
          updateData.motherLastname = formData.motherLastname;

        formPayload = { mode: "update", data: updateData };
      } else {
        const createData: NewUser = {
          firstName: formData.firstName,
          fatherLastname: formData.fatherLastname,
          email: formData.email,
          password: formData.password!,
          role: formData.role,
        };
        if (formData.midName) createData.midName = formData.midName;
        if (formData.motherLastname)
          createData.motherLastname = formData.motherLastname;

        formPayload = { mode: "create", data: createData };
      }

      switch (formPayload.mode) {
        case "update": {
            await apiPut("/users", formPayload.data);
            onSuccess();
            onClose();
          break;
        }
        case "create": {
            await apiPost("/users", formPayload.data);
            onSuccess();
            onClose();
          break;
        }
      }
    } catch (e) {
      if (e instanceof InputError) {
        setFieldErrors(e.errors);
      } else if (e instanceof Conflict) {
        setFormError(e.message);
      } else {
        setFormError("Error al crear el usuario.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isEditMode ? "Editar Usuario" : "Crear Nuevo Usuario"}
      </DialogTitle>
      <DialogContent>
        {formError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formError}
          </Alert>
        )}
        <UserEditorForm
          formData={formData}
          onFormChange={handleFormChange}
          isEditMode={isEditMode}
          fieldErrors={fieldErrors}
          passwordConfirmationError={passwordConfirmationError}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <CircularProgress size={24} />
          ) : isEditMode ? (
            "Guardar Cambios"
          ) : (
            "Crear"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
