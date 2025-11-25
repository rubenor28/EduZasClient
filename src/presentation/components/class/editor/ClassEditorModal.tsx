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
import type { Class, User } from "@domain";
import type {
  NewClass,
  ClassUpdate,
  FieldErrorDTO,
  Professor,
  PaginatedQuery,
  UserCriteria,
} from "@application";
import {
  apiPost,
  apiPut,
  InputError,
  apiDelete,
  apiGet,
} from "@application";
import { useUser } from "@presentation";

type ClassEditorModalProps = {
  open: boolean;
  onClose: () => void;
  classToEdit?: Class | null;
  isCurrentUserOwner: boolean;
  onSuccess: () => void;
};

// Se usa para obtener el isOwner de un profesor
type ClassProfessorRelation = {
  isOwner: boolean;
};

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
    { user: User; isOwner: boolean }[]
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
          const usersResult = await apiPost<PaginatedQuery<User, UserCriteria>>(
            "/users",
            { teachingInClass: classToEdit.id },
          );

          // 2. Para cada profesor, obtener su estado de propiedad
          const professorDataPromises = usersResult.results.map(
            async (profUser) => {
              const relation = await apiGet<ClassProfessorRelation>(
                `/classes/professors/${classToEdit.id}/${profUser.id}`,
              );
              return { user: profUser, isOwner: relation.isOwner };
            },
          );

          const fullProfessorData = await Promise.all(professorDataPromises);

          setInitialProfessors(fullProfessorData);
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
        {isLoadingProfessors ? (
          <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
        ) : (
          <ProfessorSelector
            isEditMode={isEditMode}
            initialProfessors={initialProfessors}
            isCurrentUserOwner={isCurrentUserOwner}
            onChange={setProfessorChanges}
            open={open}
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
