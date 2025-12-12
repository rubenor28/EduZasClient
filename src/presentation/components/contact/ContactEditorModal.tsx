import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Box,
  Typography,
  Chip,
  Alert,
} from "@mui/material";
import { useEffect, useState, type KeyboardEvent } from "react";
import { useUser } from "@presentation";
import type { Contact, User } from "@domain";
import type { FieldErrorDTO } from "@application";
import { useUserSearchByEmail } from "../../hooks/useUserSearchByEmail";
import { useContactMutations } from "../../hooks/useContactMutations";
import { useDebounce } from "../../hooks/useDebounce";
import { useContactTags } from "../../hooks/useContactTags";
import { apiGet } from "@application";
import type { Tag } from "domain/tag";

/**
 * Props para el modal de edición de contactos.
 */
type ContactEditorModalProps = {
  /** Controla la visibilidad del modal. */
  open: boolean;
  /** Función para cerrar el modal. */
  onClose: () => void;
  /** Callback ejecutado tras una operación exitosa (crear/editar). */
  onSuccess: () => void;
  /** Contacto a editar (si es null, se asume creación). */
  contactToEdit: Contact | null;
};

const initialState = {
  email: "",
  alias: "",
  notes: "",
};

/**
 * Modal completo para la gestión de contactos.
 *
 * Funcionalidades:
 * 1. Crear nuevo contacto:
 *    - Buscar usuario por email (con debounce).
 *    - Añadir alias, notas y etiquetas iniciales.
 * 2. Editar contacto existente:
 *    - Modificar alias y notas.
 *    - Gestionar etiquetas (añadir/eliminar) en tiempo real.
 * 3. Validación de errores de backend y feedback visual.
 */
export const ContactEditorModal = ({
  open,
  onClose,
  onSuccess,
  contactToEdit,
}: ContactEditorModalProps) => {
  const { user: currentUser } = useUser();
  const isEditMode = Boolean(contactToEdit);

  const [formState, setFormState] = useState(initialState);
  const [fieldErrors, setFieldErrors] = useState<FieldErrorDTO[]>([]);
  const [emailToEdit, setEmailToEdit] = useState<string>("");
  const [tagInput, setTagInput] = useState("");
  const [creationTags, setCreationTags] = useState<Tag[]>([]);

  const {
    user: searchedUser,
    isLoading: isSearchingUser,
    error: searchError,
    searchUser,
    reset: resetUserSearch,
  } = useUserSearchByEmail();

  const {
    createContact,
    updateContact,
    isLoading: isMutating,
    validationErrors: backendErrors,
    error: mutationError,
    reset: resetMutation,
  } = useContactMutations();

  const {
    tags: fetchedTags,
    isLoading: isLoadingTags,
    fetchTags,
    addTag,
    removeTag,
  } = useContactTags();

  const tags = isEditMode ? fetchedTags : creationTags;

  useEffect(() => {
    if (open && isEditMode && contactToEdit) {
      const fetchEmail = async () => {
        try {
          const user = await apiGet<User>(`/users/${contactToEdit.userId}`);
          setEmailToEdit(user.email);
        } catch (error) {
          console.error("Failed to fetch user email for editing", error);
        }
      };
      fetchEmail();
      fetchTags(currentUser.id, contactToEdit.userId);
    }
  }, [open, isEditMode, contactToEdit, fetchTags, currentUser.id]);

  useEffect(() => {
    if (open) {
      if (isEditMode && contactToEdit) {
        setFormState({
          email: emailToEdit,
          alias: contactToEdit.alias || "",
          notes: contactToEdit.notes || "",
        });
      } else {
        setFormState(initialState);
      }
    }
  }, [open, isEditMode, contactToEdit, emailToEdit]);

  const debouncedEmail = useDebounce(formState.email, 500);
  useEffect(() => {
    if (open && !isEditMode && debouncedEmail) {
      searchUser(debouncedEmail);
    }
  }, [debouncedEmail, isEditMode, open, searchUser]);

  useEffect(() => {
    if (backendErrors) {
      const mappedErrors = backendErrors.map((err) =>
        err.field.toLowerCase() === "userid" ? { ...err, field: "email" } : err,
      );
      setFieldErrors(mappedErrors);
    }
  }, [backendErrors]);

  const getErrorForField = (fieldName: string) => {
    return fieldErrors.find(
      (error) => error.field.toLowerCase() === fieldName.toLowerCase(),
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (getErrorForField(name)) {
      setFieldErrors((prev) =>
        prev.filter((err) => err.field.toLowerCase() !== name.toLowerCase()),
      );
    }
  };

  const handleTagInputKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      const newTagText: string = tagInput.trim().toUpperCase();
      if (isEditMode && contactToEdit) {
        addTag(currentUser.id, contactToEdit.userId, newTagText);
      } else {
        if (!creationTags.some((tag: Tag) => tag.text === newTagText)) {
          const newTag: Tag = { text: newTagText, createdAt: new Date() };
          setCreationTags([...creationTags, newTag]);
        }
      }
      setTagInput("");
    }
  };

  const handleTagDelete = (tagTextToDelete: string): void => {
    if (isEditMode && contactToEdit) {
      removeTag(currentUser.id, contactToEdit.userId, tagTextToDelete);
    } else {
      setCreationTags(
        creationTags.filter((tag: Tag) => tag.text !== tagTextToDelete),
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors([]);

    if (isEditMode && contactToEdit) {
      await updateContact(
        {
          agendaOwnerId: currentUser.id,
          userId: contactToEdit.userId,
          alias: formState.alias,
          notes: formState.notes,
        },
        () => {
          onSuccess();
          handleClose();
        },
      );
    } else if (searchedUser) {
      await createContact(
        {
          agendaOwnerId: currentUser.id,
          userId: searchedUser.id,
          alias: formState.alias,
          notes: formState.notes,
          tags: creationTags.map((tag: Tag) => tag.text),
        },
        () => {
          onSuccess();
          handleClose();
        },
      );
    } else {
      setFieldErrors([
        {
          field: "email",
          message: "Debes buscar y seleccionar un usuario válido.",
        },
      ]);
    }
  };

  const handleClose = () => {
    setFormState(initialState);
    setFieldErrors([]);
    resetUserSearch();
    resetMutation();
    setCreationTags([]);
    setTagInput("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isEditMode ? "Editar Contacto" : "Añadir Nuevo Contacto"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {mutationError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {mutationError.message}
            </Alert>
          )}

          <TextField
            margin="normal"
            fullWidth
            id="email"
            name="email"
            label="Email del Contacto"
            value={formState.email}
            onChange={handleChange}
            error={!!getErrorForField("email")}
            helperText={getErrorForField("email")?.message}
            disabled={isEditMode}
            InputProps={{
              endAdornment: !isEditMode && isSearchingUser && (
                <CircularProgress size={20} />
              ),
            }}
          />
          {!isEditMode && (
            <Box sx={{ mb: 2, pl: 1, height: "24px" }}>
              {searchError && (
                <Typography color="error">{searchError}</Typography>
              )}
              {searchedUser && (
                <Typography color="primary">
                  Usuario encontrado: {searchedUser.firstName}{" "}
                  {searchedUser.fatherLastname}
                </Typography>
              )}
            </Box>
          )}
          <TextField
            margin="normal"
            fullWidth
            id="alias"
            name="alias"
            label="Alias"
            value={formState.alias}
            onChange={handleChange}
            error={!!getErrorForField("alias")}
            helperText={getErrorForField("alias")?.message}
          />
          <TextField
            margin="normal"
            fullWidth
            id="notes"
            name="notes"
            label="Notas (Opcional)"
            multiline
            rows={4}
            value={formState.notes}
            onChange={handleChange}
            error={!!getErrorForField("notes")}
            helperText={getErrorForField("notes")?.message}
          />

          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Etiquetas
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              label="Añadir etiqueta y presionar Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              disabled={isEditMode && !contactToEdit}
            />
            {isLoadingTags ? (
              <CircularProgress size={24} sx={{ mt: 1 }} />
            ) : (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                {tags.map((tag) => (
                  <Chip
                    key={tag.id ?? tag.text}
                    label={tag.text}
                    onDelete={() => handleTagDelete(tag.text)}
                  />
                ))}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={isMutating}>
            {isMutating ? (
              <CircularProgress size={24} />
            ) : isEditMode ? (
              "Guardar Cambios"
            ) : (
              "Añadir"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
