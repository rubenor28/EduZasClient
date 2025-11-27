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
import { useUser, ResourceEditor } from "@presentation";

const defaultBlock = { type: "paragraph", content: "" };

export const ResourceEditorPage = () => {
  const { resourceId } = useParams<{ resourceId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();

  const [initialContent, setInitialContent] = useState<Block[]>([
    defaultBlock,
  ]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<Block[]>([defaultBlock]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrorDTO[]>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: "" });

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

        let parsedContent: Block[];
        try {
          const parsed = JSON.parse(fetchedResource.content);
          parsedContent = Array.isArray(parsed) && parsed.length > 0 ? parsed : [defaultBlock];
        } catch {
          parsedContent = [defaultBlock];
        }

        setInitialContent(parsedContent);
        setContent(parsedContent);
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
        content: JSON.stringify(content),
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
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Paper>
  );
};
