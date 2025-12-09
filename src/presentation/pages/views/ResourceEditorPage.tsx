import {
  Paper,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Snackbar,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Block } from "@blocknote/core";
import {
  apiGet,
  apiPut,
  InputError,
  type FieldErrorDTO,
  type ResourceUpdate,
  type Resource,
} from "@application";
import {
  useUser,
  ResourceEditor,
  ResourceClassAssociationManager,
} from "@presentation";

const createDefaultBlock = (): Block => ({
  id: crypto.randomUUID(),
  type: "paragraph",
  props: {
    textColor: "default",
    backgroundColor: "default",
    textAlignment: "left",
  },
  content: [],
  children: [],
});

/**
 * Página de edición de contenido académico (Recursos).
 *
 * Funcionalidades:
 * 1. Cargar el contenido existente del recurso (si `resourceId` está presente).
 * 2. Gestionar el estado del editor (título y bloques de contenido).
 * 3. Guardar los cambios en el backend.
 * 4. Gestionar la asignación del recurso a clases (`ResourceClassAssociationManager`).
 */
export const ResourceEditorPage = () => {
  const { resourceId } = useParams<{ resourceId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();

  const [initialContent, setInitialContent] = useState<Block[]>([
    createDefaultBlock(),
  ]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<Block[]>([createDefaultBlock()]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrorDTO[]>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: "" });
  const [isAssociationModalOpen, setAssociationModalOpen] = useState(false);

  useEffect(() => {
    if (!resourceId) return;

    const fetchResource = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedResource = await apiGet<Resource>(
          `/resources/${resourceId}`,
        );
        setTitle(fetchedResource.title);

        setInitialContent(fetchedResource.content);
        setContent(fetchedResource.content);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al cargar el recurso.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResource();
  }, [resourceId]);

  const handleSave = async () => {
    if (!resourceId) return;

    setIsSubmitting(true);
    setError(null);
    setFieldErrors([]);

    try {
      const payload: ResourceUpdate = {
        id: resourceId,
        title,
        content: content,
        active: true, // Assume active on save
        professorId: user.id, // This might need to come from the fetched resource
      };
      await apiPut("/resources", payload, { parseResponse: "void" });
      setSnackbar({ open: true, message: "Contenido guardado exitosamente." });
    } catch (e) {
      if (e instanceof InputError) {
        setFieldErrors(e.errors);
      } else {
        setError(e instanceof Error ? e.message : "Error al guardar.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const titleError = fieldErrors.find((fe) => fe.field === "Title")?.message;

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4">Editar Contenido</Typography>
        <Box>
          <Button
            onClick={() => setAssociationModalOpen(true)}
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Asignar a Clases
          </Button>
          <Button onClick={() => navigate("/professor/content")} sx={{ mr: 2 }}>
            Volver
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Guardar"}
          </Button>
        </Box>
      </Box>

      <ResourceEditor
        initialTitle={title}
        initialContent={initialContent}
        onTitleChange={setTitle}
        onContentChange={setContent}
        titleError={titleError}
        disabled={isSubmitting}
        onAssociationChange={() => {
          setSnackbar({
            open: true,
            message: "Asociaciones actualizadas exitosamente.",
          });
        }}
      />

      {resourceId && (
        <ResourceClassAssociationManager
          open={isAssociationModalOpen}
          onClose={() => setAssociationModalOpen(false)}
          onSuccess={() => {
            setSnackbar({
              open: true,
              message: "Asociaciones guardadas exitosamente.",
            });
            setAssociationModalOpen(false);
          }}
          resourceId={resourceId}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Paper>
  );
};
