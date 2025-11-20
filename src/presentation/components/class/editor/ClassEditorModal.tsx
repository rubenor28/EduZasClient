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
import { ClassForm, type ClassFormData } from "./ClassForm";
import type { Class } from "@domain";
import type { NewClass, ClassUpdate, FieldErrorDTO } from "@application";
import { apiPost, apiPut, InputError } from "@application";
import { useUser } from "@presentation";

type ClassEditorModalProps = {
  open: boolean;
  onClose: () => void;
  classToEdit?: Class | null;
  onSuccess: () => void;
};

const getInitialFormData = (classData?: Class | null): ClassFormData => ({
  className: classData?.className || "",
  subject: classData?.subject || "",
  section: classData?.section || "",
  color: classData?.color || "#1565C0",
  active: classData ? classData.active : true,
});

// Función para limpiar los datos antes de enviar a la API
const cleanFormData = (data: ClassFormData): ClassFormData => {
  const cleaned = { ...data };
  if (cleaned.subject === "") {
    cleaned.subject = undefined;
  }
  if (cleaned.section === "") {
    cleaned.section = undefined;
  }
  return cleaned;
};

export const ClassEditorModal = ({
  open,
  onClose,
  classToEdit,
  onSuccess,
}: ClassEditorModalProps) => {
  const { user } = useUser();
  const [formData, setFormData] = useState<ClassFormData>(
    getInitialFormData(classToEdit),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrorDTO[]>([]);

  const isEditMode = !!classToEdit;

  useEffect(() => {
    setFormData(getInitialFormData(classToEdit));
    // Resetea los errores cada vez que el modal se abre/cambia de modo
    setFormError(null);
    setFieldErrors([]);
  }, [classToEdit, open]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (color: string) => {
    setFormData((prev) => ({ ...prev, color }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFormError(null);
    setFieldErrors([]);

    // Limpia los datos del formulario antes de enviarlos
    const cleanedData = cleanFormData(formData);

    try {
      if (isEditMode) {
        const payload: ClassUpdate = { id: classToEdit!.id, ...cleanedData };
        await apiPut("/classes", payload);
      } else {
        const payload: NewClass = { ownerId: user.id, ...cleanedData };
        await apiPost("/classes", payload);
      }
      onSuccess();
      onClose();
    } catch (e) {
      if (e instanceof InputError) {
        setFieldErrors(e.errors);
      }
      else {
        const err = e instanceof Error ? e.message : "Error inesperado.";
        setFormError(err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isEditMode ? "Editar Clase" : "Crear Nueva Clase"}
      </DialogTitle>
      <DialogContent>
        {formError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formError}
          </Alert>
        )}
        <ClassForm
          formData={formData}
          onFormChange={handleFormChange}
          onColorChange={handleColorChange}
          fieldErrors={fieldErrors}
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
