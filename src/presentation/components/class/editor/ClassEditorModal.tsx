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
import {
  ProfessorSelector,
  type ProfessorSelectorChanges,
} from "./ProfessorSelector";
import type { Class } from "@domain"; // User removed
import type {
  NewClass,
  ClassUpdate,
  FieldErrorDTO,
  Professor,
  PaginatedQuery,
  ClassProfessorSummary, // Added
  ClassProfessorSummaryCriteria, // Added
} from "@application";
import {
  apiPost,
  apiPut,
  InputError,
  apiDelete,
  // apiGet, // Removed unused import
} from "@application";
import { useUser } from "@presentation";

/**
 * Props para el modal de edición de clases.
 */
type ClassEditorModalProps = {
  /** Controla la visibilidad del modal. */
  open: boolean;
  /** Función para cerrar el modal. */
  onClose: () => void;
  /** Clase a editar (si es null, se asume creación). */
  classToEdit?: Class | null;
  /** Indica si el usuario actual es el propietario de la clase. */
  isCurrentUserOwner: boolean;
  /** Callback ejecutado tras guardar cambios exitosamente. */
  onSuccess: () => void;
};

// Se usa para obtener el isOwner de un profesor
// type ClassProfessorRelation = { // Removed unused type
//   isOwner: boolean;
// };

const getInitialFormData = (classData?: Class | null): ClassFormData => ({
  className: classData?.className || "",
  subject: classData?.subject || "",
  section: classData?.section || "",
  color: classData?.color || "#1565C0",
  active: classData ? classData.active : true,
});

const cleanFormData = (data: ClassFormData): ClassFormData => {
  const cleaned = { ...data };
  if (cleaned.subject === "") cleaned.subject = undefined;
  if (cleaned.section === "") cleaned.section = undefined;
  return cleaned;
};

/**
 * Modal principal para crear o editar una clase.
 *
 * Funcionalidades:
 * 1. Gestionar los datos básicos de la clase (nombre, asignatura, color, etc.) mediante `ClassForm`.
 * 2. Gestionar la lista de profesores colaboradores mediante `ProfessorSelector`.
 * 3. Manejar la lógica de guardado (POST para crear, PUT para editar).
 * 4. Manejar la lógica de actualización de profesores (añadir, quitar, cambiar dueño).
 */
export const ClassEditorModal = ({
  open,
  onClose,
  classToEdit,
  isCurrentUserOwner,
  onSuccess,
}: ClassEditorModalProps) => {
  const { user } = useUser();
  const [formData, setFormData] = useState<ClassFormData>(
    getInitialFormData(classToEdit),
  );
  const [professorChanges, setProfessorChanges] =
    useState<ProfessorSelectorChanges>({
      toAdd: [],
      toRemove: [],
      toUpdate: [],
    });
  const [initialProfessors, setInitialProfessors] = useState<
    ClassProfessorSummary[] // Updated type
  >([]);
  const [isLoadingProfessors, setIsLoadingProfessors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrorDTO[]>([]);

  const isEditMode = !!classToEdit;

  useEffect(() => {
    if (!open) return;

    setFormData(getInitialFormData(classToEdit));
    setFormError(null);
    setFieldErrors([]);
    setProfessorChanges({ toAdd: [], toRemove: [], toUpdate: [] });
    setInitialProfessors([]);

    if (isEditMode && classToEdit) {
      const fetchProfessors = async () => {
        setIsLoadingProfessors(true);
        try {
          // 1. Obtener la lista de usuarios (profesores)
          const professorsResult = await apiPost<PaginatedQuery<ClassProfessorSummary, ClassProfessorSummaryCriteria>>(
            `/classes/${classToEdit.id}/professors/${user.id}`, // user.id for authorization, not filtering
            { page: 1, pageSize: 9999, ProfessorId: user.id, classId: classToEdit.id}, // Pass ProfessorId for alias resolution
          );
          setInitialProfessors(professorsResult.results);
        } catch (e) {
          setFormError(
            e instanceof Error ? e.message : "Error al cargar profesores.",
          );
        } finally {
          setIsLoadingProfessors(false);
        }
      };
      fetchProfessors();
    }
  }, [classToEdit, open, isEditMode]);

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

    const cleanedData = cleanFormData(formData);

    try {
      if (isEditMode) {
        // Actualizar datos de la clase
        const classPayload: ClassUpdate = {
          id: classToEdit!.id,
          ...cleanedData,
        };
        await apiPut("/classes", classPayload, { parseResponse: "void" });

        // Aplicar cambios en profesores si el usuario es dueño
        if (isCurrentUserOwner) {
          const changesPromises = [
            ...professorChanges.toAdd.map((p) =>
              apiPost(
                "/classes/professor",
                {
                  classId: classToEdit!.id,
                  userId: p.userId,
                  isOwner: p.isOwner,
                },
                { parseResponse: "void" },
              ),
            ),
            ...professorChanges.toRemove.map((p) =>
              apiDelete(`/classes/professors/${classToEdit!.id}/${p.userId}`, {
                parseResponse: "void",
              }),
            ),
            ...professorChanges.toUpdate.map((p) =>
              apiPut(
                "/classes/professors",
                {
                  classId: classToEdit!.id,
                  userId: p.userId,
                  isOwner: p.isOwner,
                },
                { parseResponse: "void" },
              ),
            ),
          ];
          await Promise.all(changesPromises);
        }
      } else {
        // Crear nueva clase
        const professorsPayload: Professor[] = professorChanges.toAdd.map(
          (p) => ({
            userId: p.userId,
            isOwner: p.isOwner,
          }),
        );
        const payload: NewClass = {
          ownerId: user.id,
          ...cleanedData,
          professors: professorsPayload,
        };
        await apiPost("/classes", payload, { parseResponse: "void" });
      }
      onSuccess();
      onClose();
    } catch (e) {
      if (e instanceof InputError) {
        setFieldErrors(e.errors);
      } else {
        setFormError(e instanceof Error ? e.message : "Error inesperado.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
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
        {isLoadingProfessors ? (
          <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
        ) : (
          <ProfessorSelector
            isEditMode={isEditMode}
            initialProfessors={initialProfessors}
            isCurrentUserOwner={isCurrentUserOwner}
            onChange={setProfessorChanges}
            open={open}
            classId={classToEdit?.id}
          />
        )}
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
